import { Injectable } from '@angular/core';
import { ItemRequest, ItemResponse, Item, Body, Keyvalue, ContextType } from 'app/models/item';
import { ElectronService } from 'ngx-electron';
import { CookieUtil } from 'app/utils/cookie';
import { FormdataService } from 'app/services/formdata.service';
import { Request, Response, URLSearchParams, RequestMethod, RequestOptionsArgs, RequestOptions, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { RequestArgs } from '@angular/http/src/interfaces';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

function mergeOptions(
  defaultOpts: BaseRequestOptions, providedOpts: RequestOptionsArgs | undefined,
  method: RequestMethod, url: string): RequestArgs {
  const newOptions = defaultOpts;
  if (providedOpts) {
    // Hack so Dart can used named parameters
    return newOptions.merge(new RequestOptions({
      method: providedOpts.method || method,
      url: providedOpts.url || url,
      search: providedOpts.search,
      params: providedOpts.params,
      headers: providedOpts.headers,
      body: providedOpts.body,
      withCredentials: providedOpts.withCredentials,
      responseType: providedOpts.responseType
    })) as RequestArgs;
  }

  return newOptions.merge(new RequestOptions({ method, url })) as RequestArgs;
}



@Injectable()
export class HttpService {

  constructor(private _electronService: ElectronService, protected _defaultOptions: RequestOptions) { }


  /**
    * Performs a request with `get` http method.
    */
  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(
      new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Get, url)));
  }

  /**
   * Performs a request with `post` http method.
   */
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(new Request(mergeOptions(
      this._defaultOptions.merge(new RequestOptions({ body: body })), options, RequestMethod.Post,
      url)));
  }

  /**
   * Performs a request with `put` http method.
   */
  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(new Request(mergeOptions(
      this._defaultOptions.merge(new RequestOptions({ body: body })), options, RequestMethod.Put,
      url)));
  }

  /**
   * Performs a request with `delete` http method.
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(
      new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Delete, url)));
  }

  /**
   * Performs a request with `patch` http method.
   */
  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(new Request(mergeOptions(
      this._defaultOptions.merge(new RequestOptions({ body: body })), options, RequestMethod.Patch,
      url)));
  }

  /**
   * Performs a request with `head` http method.
   */
  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(
      new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Head, url)));
  }

  /**
   * Performs a request with `options` http method.
   */
  options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(
      new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Options, url)));
  }


  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

    let request: Request;
    let responseObserver: Subject<Response> = new Subject<Response>();


    if (typeof url === 'string') {
      request = new Request(mergeOptions(this._defaultOptions, options, RequestMethod.Get, <string>url));
    } else if (url instanceof Request) {
      request = url;
    } else {
      throw new Error('First argument must be a url string or Request instance.');
    }
    this.setDetectedContentType(request);

    console.log(request.getBody());

    let responseBody = '';
    const clientRequest = this._electronService.remote.net.request({
      method: this.getMethod(request.method),
      redirect: 'manual',
      url: request.url,
    })
    clientRequest.chunkedEncoding = false;
    //헤더추가
    request.headers.forEach((value, name) => {
      clientRequest.setHeader(name, value);
    })

    clientRequest.on('response', (response) => {
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          let res = new Response(new ResponseOptions({
            body: responseBody,
            status: response.statusCode,
            statusText: response.statusMessage,
            headers: response.headers,
            url: request.url
          }));
          responseObserver.next(res);
        }
        else{
          let res = new Response(new ResponseOptions({
            body: response.statusMessage,
            status: response.statusCode,
            headers: response.headers,
            url: request.url
          }));
          responseObserver.error(res);
        }
        responseObserver.complete();
        
      })
      response.on('data', (chunk) => {
        responseBody += chunk.toString();
      })
      response.on('error', (error) => {
        responseObserver.error(new Response(new ResponseOptions({
          body: error,
          status: response.statusCode,
          headers: response.headers,
          url: request.url
        })));
        responseObserver.complete();
      })
    })
    clientRequest.write(request.getBody().replace('+','%2B'));
    clientRequest.on('error', (error) => {
      responseObserver.error(new Response(new ResponseOptions({
        body: error,
        status: 0,
        url: request.url
      })));
      responseObserver.complete();
    })
    clientRequest.end()


    return responseObserver.asObservable();
  }

  private getMethod(method) {
    switch (method) {
      case RequestMethod.Get:
        return 'GET';
      case RequestMethod.Post:
        return 'POST';
      case RequestMethod.Delete:
        return 'DELETE';
      case RequestMethod.Head:
        return 'HEAD';
      case RequestMethod.Options:
        return 'OPTIONS';
      case RequestMethod.Patch:
        return 'PATCH';
      case RequestMethod.Put:
        return 'PUT';
    }

  }

  setDetectedContentType(req: Request, ) {
    // Skip if a custom Content-Type header is provided
    if (req.headers != null && req.headers.get('Content-Type') != null) {
      return;
    }
    // Set the detected content type
    switch (req.detectContentType()) {
      case 0:
        break;
      case 1:
        req.headers.append('content-type', 'application/json');
        break;
      case 2:
        req.headers.append('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        break;
      case 4:
        req.headers.append('content-type', 'text/plain');
        break;
    }
  };

}
