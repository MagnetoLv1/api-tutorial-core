import { Injectable } from '@angular/core';
import { HttpService } from 'app/services/http.service';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class UpdateService {

  constructor(private _electronService: ElectronService, private httpService: HttpService) { }


  getNewVersion(): Promise<any> {
    let currentVersion = this._electronService.remote.app.getVersion();
    let env = this._electronService.remote.process.env;
    return new Promise((resolve, reject) => {
      if (!env.update_check_url) {
        reject();
      }
      this.getLatest(env.update_check_url).then((response) => {

        if (this.isGitLab(response)) {

          let newVersion = this.getGitLabLatestVersion(response);
          if (this.versionCompare(newVersion, currentVersion) > 0) {
            if (env.update_site) {
              resolve({
                version: newVersion,
                url: env.update_site
              })
            } else {
              reject();
            }
          }
          else {
            reject()
          }

        } else if (this.isWiki(response)) {
          let newVersion = this.getWikiLatestVersion(response);
          if (this.versionCompare(newVersion, currentVersion) > 0) {
            if (env.update_site) {
              resolve({
                version: newVersion,
                url: env.update_site
              })
            } else {
              reject();
            }
          }
          else {
            reject()
          }
        }
        else {
          if (this.versionCompare(response.tag_name, currentVersion) > 0) {
            resolve({
              version: response.tag_name,
              url: response.html_url
            })
          }
          else {
            reject()
          }
        }

      })
    });
  }
  /**
   * 로그인 토근가져오기
   * @param param 
   */
  private getLatest(url): Promise<any> {

    return new Promise((resolve, reject) => {
      this.httpService.get(url)
        .subscribe(res => {
          let data = JSON.parse(res.text());
          resolve(data);
        },
        error => {
          reject(error);
        })
    });

  }

  private isWiki(response) {
    return response["query"] ? true : false;
  }
  private isGitLab(response) {
    return response && response.length && response.filter((val) => {
      return val.name ? true : false;
    }).length ? true : false;
  }

  private getGitLabLatestVersion(response) {
    let names = response.map((val) => {
      return val.name;
    }).sort();
    return names.pop();
  }

  private getWikiLatestVersion(response) {
    let latestVersion = '0.0.0';
    if (response.query && response.query.pages) {
      let id = Object.keys(response.query.pages)[0];
      let pages = response.query.pages[id];
      for (let info of pages.imageinfo) {
        console.log(latestVersion, info.comment, this.versionCompare(info.comment, latestVersion))
        if (this.versionCompare(info.comment, latestVersion) > 0) {
          latestVersion = info.comment;
        }
      }
    }
    return latestVersion;
  }

  private versionCompare(left, right) {
    if (typeof left + typeof right != 'stringstring')
      return false;

    var a = left.replace('v', '').split('.')
      , b = right.replace('v', '').split('.')
      , i = 0, len = Math.max(a.length, b.length);

    for (; i < len; i++) {
      if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
        return 1;
      } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
        return -1;
      }
    }

    return 0;
  }
}
