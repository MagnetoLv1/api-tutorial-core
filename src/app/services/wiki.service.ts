import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ItemRequest, ItemResponse, Item, Body, Keyvalue, ContextType } from 'app/models/item';
import { FormdataService } from 'app/services/formdata.service';
import { CookieUtil } from 'app/utils/cookie';

@Injectable()
export class WikiService {

  private _wikiCookies: Array<any>;
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

  wikiLogin(id, password): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getLoginToken().then(token => {
        this.getLoginSession({
          id: id,
          password: password,
          token: token
        }).then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      });
    });
  }


  getLoginSession(param: any): Promise<void> {
    let urlencoded: Array<Keyvalue> = [
      new Keyvalue('wpName', param.id),
      new Keyvalue('wpPassword', param.password),
      new Keyvalue('wpLoginToken', param.token),
      new Keyvalue('wpLoginAttempt', '로그인'),
    ];
    let requestBody = new Body(ContextType.urlencoded, [], urlencoded);
    let formdataService = new FormdataService(requestBody);

    let body = '';
    return new Promise((resolve, reject) => {
      const clientRequest = this._electronService.remote.net.request({
        method: 'POST',
        redirect: 'manual',
        url: `http://wiki.nowcom.co.kr/wiki/index.php?title=특수기능:로그인&action=submitlogin&type=login&returnto=대문`,
      })
      clientRequest.chunkedEncoding = false;
      clientRequest.setHeader('Content-Type', formdataService.getContentType());
      clientRequest.setHeader('Cookie', CookieUtil.toString(this.wikiCookies));
      clientRequest.on('response', (response) => {
        reject();
      })
      clientRequest.on('redirect', (statusCode, method, redirectUrl, responseHeaders) => {
        this.wikiCookies = CookieUtil.merge(this.wikiCookies, CookieUtil.parse(responseHeaders['set-cookie']));
        resolve();
      })
      clientRequest.write(formdataService.getBody());
      clientRequest.on('error', (error) => {
        reject();
      })
      clientRequest.end()
    });
  }

  getLoginToken(): Promise<String> {

    let body = '';
    return new Promise((resolve, reject) => {
      const clientRequest = this._electronService.remote.net.request({
        method: 'POST',
        url: `http://wiki.nowcom.co.kr/wiki/index.php?title=특수기능:로그인`,
      })
      clientRequest.chunkedEncoding = false;
      var headers = [];
      //헤더추가
      for (let header of headers) {
        if (header.key) {
          clientRequest.setHeader(header.key, header.value);
        }
      }

      clientRequest.on('response', (response) => {
        let total = 0;
        response.on('end', () => {
          this.wikiCookies = CookieUtil.parse(response.headers['set-cookie']);
          resolve(this.getHiddens(body)['wpLoginToken']);
        })
        response.on('data', (chunk) => {
          body += chunk.toString();
          total += chunk.length;
        })
        response.on('error', (error) => {
          reject(error.toString());
        })
      })
      clientRequest.on('error', (error) => {
        reject(error.toString());
      })
      clientRequest.end()
    });
  }

  constructor(private _electronService: ElectronService) { }

  session(): Promise<Boolean> {

    let title = "테스트양";
    let body = '';
    return new Promise((resolve, reject) => {
      const clientRequest = this._electronService.remote.net.request({
        method: 'POST',
        url: `http://wiki.nowcom.co.kr/wiki/index.php?title=%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%96%91&action=edit`,
      })
      clientRequest.chunkedEncoding = false;
      var headers = [];
      //헤더추가
      for (let header of headers) {
        if (header.key) {
          clientRequest.setHeader(header.key, header.value);
        }
      }

      clientRequest.on('response', (response) => {
        let total = 0;
        response.on('end', () => {
          resolve(false);
        })
        response.on('data', (chunk) => {
          body += chunk.toString();
          total += chunk.length;
        })
        response.on('error', (error) => {
          reject(error.toString());
        })
      })
      clientRequest.on('error', (error) => {
        reject(error.toString());
      })
      clientRequest.end()
    });
  }

  save(item: Item): Promise<Boolean> {

    let body = '';
    return new Promise((resolve, reject) => {
      const clientRequest = this._electronService.remote.net.request({
        method: 'POST',
        url: `http://wiki.nowcom.co.kr/wiki/index.php?title=${item.name}&action=submit`,
      })
      clientRequest.chunkedEncoding = false;


      var formdataService = new FormdataService(item.request.body);
      clientRequest.setHeader('Content-Type', formdataService.getContentType());
      //헤더추가
      for (let header of item.request.header) {
        if (header.key) {
          clientRequest.setHeader(header.key, header.value);
        }
      }

      clientRequest.on('response', (response) => {
        let total = 0;
        response.on('end', () => {
          resolve(false);
        })
        response.on('data', (chunk) => {
          body += chunk.toString();
          total += chunk.length;
        })
        response.on('error', (error) => {
        })
      })
      clientRequest.on('error', (error) => {
        reject(error.toString());
      })
      clientRequest.write(formdataService.getBody());
      clientRequest.end()

    });
  }

  /**
   * 히든값
   * @param html 
   */
  private getHiddens(html: string) {
    var reg = /<input type="hidden" name="([^"]*?)" value="([^"]*?)" \/>/g;
    var match
    var matches = [];
    while (match = reg.exec(html)) {
      matches[match[1]] = match[2];
    }
    return matches;
  }

}
