import { Injectable } from '@angular/core';
import { IBody } from 'app/builder/request/interface/item';

@Injectable()
export class FormdataService {

  static LINE_BREAK: string = '\r\n';
  static DEFAULT_CONTENT_TYPE = 'application/octet-stream';
  private _boundary: string = '';
  private _body: IBody
  constructor(body: IBody) {
    this._body = body;
  }

  public getContentType() {
    if (this._body.mode == 'urlencoded') {
      return 'application/x-www-form-urlencoded';
    } else if (this._body.mode == 'formdata') {
      return 'multipart/form-data; boundary=' + this.getBoundary();
    }
    else{
      return 'text/plain';
    }
  }

  public getBody() {
    var body = '';
    if (this._body.mode == 'urlencoded') {
      var param = [];
      for( var key in this._body.urlencoded){
          var data = this._body.urlencoded[key];
          if(data.key){
            param.push(data.key +'='+ encodeURI(data.value));
          }
      }
      body = param.join('&');
    } else if (this._body.mode == 'formdata') {
      for( var key in this._body.formdata){
          var data = this._body.formdata[key];
          if(data.key){
            body += this._multiPartHeader(data.key, data.value);
          }
      }
      body += this._lastBoundary();
    }
    return body;
  }

  public getBoundary() {
    if (!this._boundary) {
      this._generateBoundary();
    }

    return this._boundary;
  };

  private _multiPartHeader(key, value) {   
    return '--' + this.getBoundary() + FormdataService.LINE_BREAK 
                   + 'Content-Disposition: form-data; name="'+key+'"' + FormdataService.LINE_BREAK+ FormdataService.LINE_BREAK
                   + value + FormdataService.LINE_BREAK;
  }

  private _multiPartFooter() {
    return function (next) {
      var footer = FormdataService.LINE_BREAK;

      var lastPart = (this._streams.length === 0);
      if (lastPart) {
        footer += this._lastBoundary();
      }

      next(footer);
    }.bind(this);
  };

  private _generateBoundary() {
    // This generates a 50 character boundary similar to those used by Firefox.
    // They are optimized for boyer-moore parsing.
    var boundary = '--------------------------';
    for (var i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }

    this._boundary = boundary;
  };

  private _lastBoundary() {
    return '--' + this.getBoundary() + '--' + FormdataService.LINE_BREAK;
  };
}
