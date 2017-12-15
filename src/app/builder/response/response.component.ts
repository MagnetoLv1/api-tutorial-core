import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IResponse } from "app/builder/request/interface/item";


@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements OnChanges, OnInit {

  private _body: String;


  @Input() response: IResponse;
  constructor() { }

  ngOnChanges(changes: {}) {
    console.log('ngOnChanges', changes);
  }

  get body() {
    return this.response.body;
  }

  get cookies() {
    return this.response.headers ? this.response.headers['Set-Cookie'] : '';
  }

  get headers() {
    return this.response.headers;
  }
  ngOnInit() {
  }

}
