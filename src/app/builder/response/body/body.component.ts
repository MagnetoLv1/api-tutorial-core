import { Component, OnInit, Input, ViewChild, ElementRef, NgZone, Output, EventEmitter } from '@angular/core';
import { FilesystemService } from '../../../services/filesystem.service';
import * as Electron from 'electron';
import * as fs from 'fs';
import { Keyvalue } from 'app/models/item';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { BodySavePromptComponent } from 'app/builder/response/body/save.prompt/save.prompt.component';
@Component({
  selector: 'response-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  @Input() body: string = '';
  @Input() examples: Array<Keyvalue> = [];
  reader: FileReader;
  _format: string = 'raw';

  bodyJson: string;
  height: number;
  @Output() saveEvent = new EventEmitter<Keyvalue>();
  constructor(private zone: NgZone, private filesystemService: FilesystemService,  public modal: Modal) {
  }

  ngOnInit() {
  }

  set format(val: string) {
    this._format = val;

    switch (this._format) {
      case 'pretty':
        this.bodyToJson();
        this.height = 0;
        break;
      case 'raw':
        this.height = 0;
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

  onSave() {
    
    this.modal.open(BodySavePromptComponent, overlayConfigFactory({},
      BSModalContext)).then((resultPromise) => {
        return resultPromise.result.then((name) => {
          let body;
          try{
            body = JSON.stringify(JSON.parse(this.body), null, 2);
          }catch(error){
            body = this.body;
          }
          let example = new Keyvalue(name, body);
          console.log('push',example)
          this.examples.push(example);
          this.saveEvent.emit(example);
        });
      });

  }
}