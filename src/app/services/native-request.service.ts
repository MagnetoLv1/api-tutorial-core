import { Injectable, EventEmitter } from '@angular/core';
import { RequestOptionsArgs } from "@angular/http";
import { ElectronService } from 'ngx-electron';
import { IRequest, IResponse, IKeyvalue } from "app/builder/request/interface/item";

@Injectable()
export class NativeRequestService {


  _ipcRenderer: Electron.IpcRenderer;
  status: number;
  statusText: string;
  headers: Array<IKeyvalue>;

  constructor(private _electronService: ElectronService) {
    this._ipcRenderer = _electronService.ipcRenderer;
  }

  /**
   * 
   * @param url 
   * @param options 
   */
  request(request: IRequest): Promise<IResponse> {

    let responseInit: ResponseInit = null;
    let body = '';

    return new Promise((resolve, reject) => {

      this._ipcRenderer.on('remote.response-start', (event, statusCode, statusMessage, headers) => {
        this.headers = headers;
        this.status = statusCode;
        this.statusText = statusMessage;
      });
      this._ipcRenderer.on('remote.response-body', (event, chunk) => {
        body += chunk.toString();
      })
      this._ipcRenderer.on('remote.response-complete', (event) => {
        resolve(<IResponse>{
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          body: body
        });
      })
      this._ipcRenderer.on('remote.request-finish', (event) => {
        //console.log(arg) // prints "pong" 
      })
      this._ipcRenderer.on('remote.request-abort', (event) => {
        reject(Error('abort'));
      })
      this._ipcRenderer.on('remote.request-error', (event, error) => {
        console.log('remote.request-error', error, error.toString())
        reject(error);
      })

      this._ipcRenderer.sendSync('native.request', request);
    })
  }
}
