import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ItemRequest, ItemResponse, Item, Body, Keyvalue, ContextType } from 'app/models/item';
import { FormdataService } from 'app/services/formdata.service';
import { CookieUtil } from 'app/utils/cookie';
import { HttpService } from 'app/services/http.service';
import { HttpClient, HttpRequest } from 'selenium-webdriver/http';
import { Response, URLSearchParams, Headers } from '@angular/http';
import { Cookies } from 'electron';
import { CollectionService } from 'app/services/collection.service';
import { CONFIG } from 'app/enums';
import { WikiTemplate } from 'app/services/wiki.api.template';

@Injectable()
export class WikiService {

  private wikiApi:string ='';
  private wikiRootTitle:string ='';
  private _wikiCookies: Array<any>;
  constructor(private _electronService: ElectronService, private collectionService: CollectionService, private httpService: HttpService) { 

      let env = this._electronService.remote.process.env;
      this.wikiApi = env.wiki_api
      this.wikiRootTitle = env.wiki_root_title
  }


  set wikiCookies(cookies) {
    this._wikiCookies = cookies;
    this.setLocalStroageCookies(this._wikiCookies);
    
  };

  get wikiCookies() {
    if (!this._wikiCookies) {
      this._wikiCookies = this.getLocalStroageCookies();
    }
    return this._wikiCookies;
  };

  getLocalStroageCookies() {
    if (localStorage.getItem('wikiCookie')) {
      return JSON.parse(localStorage.getItem('wikiCookie'));
    } else {
      return [];
    }
  }
  setLocalStroageCookies(cookies) {
    if (cookies && cookies.length) {
      localStorage.setItem('wikiCookie', JSON.stringify(cookies));
    }
  }

  /**
   * 로그인 여부
   */
  public isLogin() {
    return this.wikiCookies.find(cookie => {
      return cookie.name == 'wiki_db_wiki_UserName'
    }) ? true : false;
  }

  /**
   * 위키 로그인
   * @param id 
   * @param password 
   */
  wikiLogin(id, password): Promise<void> {
    return new Promise((resolve, reject) => {

      this.getLoginToken({
        id: id,
        password: password
      }).then(token => {
        console.log('token', token)
        this.getLoginSession({
          id: id,
          password: password,
          token: token
        }).then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      }).catch(() => {
        reject();

      });
    });
  }

  editWiki(path, title, text): Promise<void> {
    return new Promise((resolve, reject) => {
      //루트이면 생성되었다함;
      if (path == CONFIG.root_path) {
        reject('The top level can not be created.');
        return;
      }
      this.getEditToken(title).then(token => {

        this.getEditWiki(title, text, token).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        })
      }).catch((error) => {
        reject(error);

      });
    });
  }

  /**
   *  부모WIKI 생성하기
   * @param childItem 
   */
  public parentWiki(childItem: Item): Promise<string> {

    return new Promise((resolve, reject) => {
      let parentPath = this._parentPath(childItem.path);
      if (parentPath == CONFIG.root_path) {
        resolve(this.wikiRootTitle);
        return;
      }
      this.collectionService.get(parentPath).subscribe((data: any) => {
        data.path = parentPath;
        this.exitParent(data.name).then(() => {
          //존재하는 경우
          console.log('ParentName', data.name);
          resolve(data.name);
        }).catch(() => {
          //존재하지 않는경우
          //--부모의부모 체크
          this.parentWiki(data).then((parentName) => {
            //부모생성
            this._createParentWiki(data, parentName).then((name) => {
              console.log('ParentName', name);
              resolve(name);
            }).catch((error) => {
              reject(error);
            });
          }).catch((error) => {
            reject(error);
          });
        });
      })
    });
  }


  /**
   * 로그인 토근가져오기
   * @param param 
   */
  private getLoginToken(param): Promise<String> {

    let urlSearchParams: URLSearchParams = new URLSearchParams();
    urlSearchParams.append('action', 'login');
    urlSearchParams.append('lgname', param.id);
    urlSearchParams.append('lgpassword', param.password);

    return new Promise((resolve, reject) => {
      this.httpService.post(this.wikiApi, urlSearchParams)
        .subscribe(res => {
          this.wikiCookies = CookieUtil.parse(res.headers['set-cookie']);
          let data = JSON.parse(res.text());
          if (data.login.result == 'NeedToken') {
            resolve(data.login.token);
          }
          else {
            console.log(data);
            reject(data.login.result);
          }
        },
        error => {
          reject(error);
        })
    });

  }

  /**
   * 로그인
   * @param param 
   */
  private getLoginSession(param: any): Promise<void> {
    let urlSearchParams: URLSearchParams = new URLSearchParams();
    urlSearchParams.append('action', 'login');
    urlSearchParams.append('lgname', param.id);
    urlSearchParams.append('lgpassword', param.password);
    urlSearchParams.append('lgtoken', param.token);
    let header = new Headers();
    header.append('Cookie', CookieUtil.toString(this.wikiCookies));
    return new Promise((resolve, reject) => {
      this.httpService.post(this.wikiApi, urlSearchParams, { headers: header })
        .subscribe(res => {
          this.wikiCookies = CookieUtil.merge(this.wikiCookies, CookieUtil.parse(res.headers['set-cookie']));
          let data = JSON.parse(res.text());
          if (data.login.result == 'Success') {
            resolve();
          }
          else {
            reject(data.login.result);
          }
        },
        error => {
          reject(error);
        })
    });



  }



  /**
   * 글쓰기 토큰 가져오기
   * @param title 
   */
  private getEditToken(title): Promise<String> {

    let urlSearchParams: URLSearchParams = new URLSearchParams();
    urlSearchParams.append('action', 'query');
    urlSearchParams.append('prop', 'info');
    urlSearchParams.append('intoken', 'edit');
    urlSearchParams.append('titles', title);

    let header = new Headers();
    header.append('Cookie', CookieUtil.toString(this.wikiCookies));
    return new Promise((resolve, reject) => {
      this.httpService.post(this.wikiApi, urlSearchParams, { headers: header })
        .subscribe(res => {
          this.wikiCookies = CookieUtil.merge(this.wikiCookies, CookieUtil.parse(res.headers['set-cookie']));
          let data = JSON.parse(res.text());
          console.log(data);
          let keys = Object.keys(data.query.pages);
          let key = keys[0];
          console.log(data.query.pages[key].edittoken)
          resolve(data.query.pages[key].edittoken);
        },
        error => {
          reject(error);
        })
    });
  }

  /**
   * 글쓰기 토큰 가져오기
   * @param title 
   */
  private getEditWiki(title, text, token): Promise<String> {

    let urlSearchParams: URLSearchParams = new URLSearchParams();
    urlSearchParams.append('action', 'edit');
    urlSearchParams.append('token', token);
    urlSearchParams.append('title', title);
    urlSearchParams.append('text', text);

    let header = new Headers();
    header.append('Cookie', CookieUtil.toString(this.wikiCookies));
    return new Promise((resolve, reject) => {
      this.httpService.post(this.wikiApi, urlSearchParams, { headers: header })
        .subscribe(res => {
          this.wikiCookies = CookieUtil.merge(this.wikiCookies, CookieUtil.parse(res.headers['set-cookie']));
          let data = JSON.parse(res.text());
          if (data.edit && data.edit.result == 'Success') {
            resolve('정상적으로 WIKI에 등록되었습니다.');
          } else {
            reject(data.error.info);
          }
        },
        error => {
          reject(error);
        })
    });
  }



  private exitParent(title): Promise<void> {

    let urlSearchParams: URLSearchParams = new URLSearchParams();
    urlSearchParams.append('action', 'query');
    urlSearchParams.append('titles', '분류:' + title);

    let header = new Headers();
    header.append('Cookie', CookieUtil.toString(this.wikiCookies));
    return new Promise((resolve, reject) => {
      this.httpService.post(this.wikiApi, urlSearchParams, { headers: header })
        .subscribe(res => {
          this.wikiCookies = CookieUtil.merge(this.wikiCookies, CookieUtil.parse(res.headers['set-cookie']));
          let data = JSON.parse(res.text());
          let keys = Object.keys(data.query.pages);
          (parseInt(keys[0]) > 0) ? resolve() : reject();
        },
        error => {
          reject(error);
        })
    });
  }


  /**
   * 부모경로 구하기
   * @param path 
   */
  private _parentPath(path: string) {
    let paths = path.split('/');
    let newPaths = paths.slice(0, paths.length - 2);
    if (paths.length > 2) {
      return newPaths.join('/');
    } else {
      return path;
    }
  }


  /**
   * 부모위키 만들기
   * @param item 
   * @param parentName 
   */
  private _createParentWiki(item: Item, parentName: string): Promise<string> {
    let title = '분류:' + item.name
    let description = WikiTemplate.parent(item.description, parentName);
    return new Promise((resolve, reject) => {
      if (item.path == CONFIG.root_path) {
        resolve(this.wikiRootTitle);
        return;
      }
      this.editWiki(item.path, title, description).then(() => {
        resolve(item.name);
      }).catch((error) => {
        reject(error);
      })
    });
  }


}
