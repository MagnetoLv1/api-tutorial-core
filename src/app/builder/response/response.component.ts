import { Component, OnInit, Input } from '@angular/core';
import { IResponse } from "app/builder/request/interface/item";
import { ItemResponse } from 'app/models/request';


@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements  OnInit {

  private _body: String;

  display_response:string='body';
  @Input() response: ItemResponse;
  constructor() { }

  get body() {
    return this.response.body;
  }

  get cookies() {
    return this.response.headers ? this.response.headers['Set-Cookie'] :{};
  }

  get headers() {
    return this.response.headers;
  }
  ngOnInit() {
  }

}
