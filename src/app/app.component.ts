import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { UpdateService } from 'app/services/update.service';
import { MenuService } from 'app/services/menu.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  size = [25, 75];
  menu;
  noti: Boolean = false;
  version: string;
  url: string;
  constructor(private _electronService: ElectronService, private menuService: MenuService, private updateService: UpdateService, private titleService: Title) {
      
  }



  ngOnInit() {
    if (localStorage.getItem('split-size')) {
      this.size = JSON.parse(localStorage.getItem('split-size'));
    }

    //타이틀 버전 넣기
    let title = this.titleService.getTitle()
    let currentVersion  = this._electronService.remote.app.getVersion();
    this.titleService.setTitle(`${title} (${currentVersion})`);

    //업데이트 체크
    this.updateService.getNewVersion().then((data) => {
      console.log(data);
      this.version = data.version;
      this.url = data.url;
      this.noti = true;
    }).catch(() => {

    });


  }

  onDragEnd($event) {
    localStorage.setItem('split-size', JSON.stringify($event));
  }

  onNotiClose(){
    console.log('onNotiClose')
    this.noti =false;
  }

}

