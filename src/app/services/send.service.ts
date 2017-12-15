import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestMethod, RequestOptionsArgs, ResponseOptions } from '@angular/http';
import parseuri from 'parseuri';
import { parse } from 'querystring';
import { ElectronService } from 'ngx-electron';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { IKeyvalue, IResponse, IRequest } from 'app/builder/request/interface/item';


@Injectable()
export class SendService {

  headers: Headers;
  _response: Response;

  constructor(private _electronService: ElectronService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'multipart/form-data');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('User-Agent', 'developer=anyman;PdboxTicket=.A32.7bbT56vyHM9fKZk.L8dNW9jvu8Flr2f1MdW2FGYrf4j1KN_D3MiAaZToxDYCF5i9eZnVaESChk94GWupCMMPRMMKTuLf0D7B2EJdWmmTox4dymRvMIzDjaYB_qYKIzLq-IepcwL4w6-HnleIv22qybJg5wO2E7MuusTJwQ8pQDVRPxYrvvDTv-JYvwcNWp_8Soyg1p1VGNNZC59INO-IeApNc5fY191tNSZq9Z7rbVo-cNupwbTNOH9ZrklgkaSPyk3L7AjQL_9fcOr9T3bkyKZn3ts9Jcu_NBaVxAn76BDjBY437buSSDgWKjLJ0hQjBRP9xBSOhen-o5zmd4Nh2q4H4YENL_QknBUO4iHsuhwBu2sQHwWSi1qnOatzXzTHr7bDKjX1f9zixDl982Obtq5_Q-Gs2P26eavUbn7wfioBYxxynuKQqAc9ZNzDpNIURGAQ-He_G3nbJBP5krsgAIv9tqsR9x8vTTnVfgGRGo3GnZY7DHjgDmh4WXXCjF_xHme51cy4nYsCpbxF8dNprP6XBPVukotkyiBLCAeont3BZCkOOmTGyzz5WGs;');
    this._response = new Response(new ResponseOptions());
    this._response.status = 404;
    const ro = new ResponseOptions();
  }



  request(request: IRequest): Promise<IResponse> {

    console.log(request);
    let body = '';
    let status: number;
    let statusText: string;
    let headers: Array<IKeyvalue>;
    return new Promise((resolve, reject) => {
      const clientRequest = this._electronService.remote.net.request({
        method: request.method,
        url: request.url,
      })
      clientRequest.chunkedEncoding = false;

      //헤더추가
      for (let header of request.header) {
        clientRequest.setHeader(header.key, header.value);
      }


      clientRequest.on('response', (response) => {
        headers = response.headers;
        status = response.statusCode;
        statusText = response.statusMessage;

        console.log(`STATUS: ${response.statusCode}`)
        console.log(`statusMessage: ${response.statusMessage}`)
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`)

        let total = 0;
        response.on('end', () => {
          resolve(<IResponse>{
            status: status,
            statusText: statusText,
            headers: headers,
            body: body
          });
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
      clientRequest.end()

    });
  }
}
