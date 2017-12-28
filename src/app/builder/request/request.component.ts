import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NativeRequestService } from "../../services/native-request.service";
import { IRequest, IResponse, IItem } from "./interface/item";
import { SendService } from 'app/services/send.service';
import { ItemRequest, Item, ItemResponse, Keyvalue, Body } from 'app/models/request';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  @Input() item: Item;
  @Output() responseChange = new EventEmitter<ItemResponse>();
  @Output() saveEvent = new EventEmitter<String>();

  show_description: Boolean = false;
  constructor(private nativeRequestService: NativeRequestService, private sendService: SendService) {
  }


  _display_request: string = 'body';
  get display_request(): string {
    if (!this.item.request.body) {
      return 'header';
    }
    return this._display_request;
  }
  set display_request(value: string) {
    this._display_request = value;
  }

  get request(): ItemRequest {
    return this.item.request;
  }
  get body(): any {
    return this.item.request.body;
  }
  get urlencoded(): any {
    return this.item.request.body ? this.item.request.body.urlencoded : [];
  }
  get raw(): string {
    return this.item.request.body.raw;
  }

  get formdata(): any {
    return this.item.request.body ? this.item.request.body.formdata : [];
  }

  ngOnInit() {
  }

  get method() {
    return this.item.request.method ? this.item.request.method : 'GET';
  }
  set method(val) {
    this.item.request.method = val;
    if(this.item.request.method == 'GET'){
      this.item.request.body = null;
    }else{
      if(!this.item.request.body){
        this.item.request.body = new Body();
      }
    }
  }

  get mode() {
    return this.item.request.body ? this.item.request.body.mode : 'urlencoded';
  }

  set mode(value: string) {
    this.item.request.body.mode = value;
  }

  get header() {
    return this.item.request.header;
  }

  onSend() {

    this.responseChange.emit(new ItemResponse(-1));
    this.sendService.request(this.item.request).then((response) => {
      this.responseChange.emit(response);
    }).catch((e) => {
      console.log(e);
    });
  }


  onSave() {
    this.saveEvent.emit('save');
  }
}
