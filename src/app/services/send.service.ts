import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestMethod, RequestOptionsArgs, ResponseOptions } from '@angular/http';
import parseuri from 'parseuri';
import { parse } from 'querystring';
import { ElectronService } from 'ngx-electron';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { FormdataService } from 'app/services/formdata.service';
import { Keyvalue, ItemResponse, ItemRequest } from 'app/models/request';


@Injectable()
export class SendService {

  headers: Headers;
  _response: ItemResponse;
  constructor(private _electronService: ElectronService) {
    this.headers = new Headers();

    var Notification =  this._electronService.remote.Notification;

  }



  request(request: ItemRequest): Promise<ItemResponse> {
    
    let body = '';
    return new Promise((resolve, reject) => {
      const clientRequest = this._electronService.remote.net.request({
        method: request.method,
        url: request.url,
      })
      clientRequest.chunkedEncoding = false;


      var formdataService = new FormdataService(request.body);
      clientRequest.setHeader('Content-Type', formdataService.getContentType());
      //헤더추가
      for (let header of request.header) {
        if (header.key) {
          clientRequest.setHeader(header.key, header.value);
        }
      }

      clientRequest.on('response', (response) => {
        let total = 0;
        response.on('end', () => {
          resolve(new ItemResponse(
            response.statusCode,
            response.statusMessage,
            response.headers,
            body
          ));
        })
        response.on('data', (chunk) => {
          body += chunk.toString();
          total += chunk.length;
        })
        response.on('error', (error) => {
          console.log(error);
        })
      })
      clientRequest.on('error', (error) => {
        console.log(error);
        reject(error.toString());
      })
      clientRequest.write(formdataService.getBody());
      clientRequest.end()

    });
  }
}
