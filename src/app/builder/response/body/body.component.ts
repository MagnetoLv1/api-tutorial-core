import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FilesystemService } from '../../../services/filesystem.service';
import * as Electron from 'electron';
import * as fs from 'fs';
@Component({
  selector: 'response-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  @Input() body: string = '';
  reader: FileReader;
  _format: string;

  bodyJson: string;
  height: number;
  constructor(private zone: NgZone, private filesystemService: FilesystemService) {
  }

  ngOnInit() {
  }

  set format(val: string) {
    this._format = val;

    switch (this._format) {
      case 'pretty':
        this.bodyToJson();
        this.height=0;
        break;
      case 'raw':
        this.height=0;
        break;
      case 'privew':
        this.bodyToWebview();
        break;
    }
  }
  get format(): string {
    return this._format;
  }


  /**
   * https://github.com/matiboy/angular2-prettyjson
   */
  private _jsonBody: string;
  protected bodyToJson() {
    if (this._jsonBody == this.body) {
      return;
    }
    this._jsonBody = this.body;

    try {
      this.bodyJson = JSON.parse(this.body);
    } catch (error) {
      this.bodyJson = this.body;
    }
  }

  private _previewBody: string;
  protected bodyToWebview() {
    if (this._previewBody == this.body) {
      return;
    }
    this._previewBody = this.body;

    let that = this;
    this.filesystemService.writeFile('./preview.html', this.body, () => {
      let path = 'file://' + that.filesystemService.realpathSync('./preview.html');
      const webview: any = document.getElementById('webview');
      webview.addEventListener('dom-ready', (e) => {

        webview.executeJavaScript("document.body.scrollHeight", (scrollHeight) => {
          this.zone.run(() => {
            this.height = scrollHeight + 100;
            console.log(this.height);
          });
        });
      })
      webview.loadURL(path);
    })
  }
}