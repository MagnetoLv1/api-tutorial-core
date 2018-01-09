import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SendService } from 'app/services/send.service';
import { ItemRequest, Item, ItemResponse, Keyvalue, Body, ContextType } from 'app/models/item';
import { WikiService } from 'app/services/wiki.service';
import { ToastrService } from 'ngx-toastr';
import { WikiLoginComponent } from 'app/builder/wiki/login/login.component';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { WikiTemplate } from 'app/services/wiki.api.template';

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
  constructor(private sendService: SendService, private wikiService: WikiService, private toastr: ToastrService, public modal: Modal) {
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
    if (this.item.request.method == 'GET') {
      this.item.request.body = null;
    } else {
      if (!this.item.request.body) {
        this.item.request.body = new Body();
      }
    }
  }

  get mode() {
    return this.item.request.body ? this.item.request.body.mode : ContextType.urlencoded;
  }

  set mode(value: string) {
    this.item.request.body.mode = value;
  }

  get header() {
    return this.item.request.header;
  }

  onSend() {

    console.log('is login : ', this.wikiService.isLogin())
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

  onWiki() {
    if (this.wikiService.isLogin()) {
        console.debug('로그인되었음');
        console.log(WikiTemplate.api(this.item));
        
    } else {

      this.modal.open(WikiLoginComponent, overlayConfigFactory({},
        BSModalContext)).then((resultPromise) => {
          return resultPromise.result.then((result) => {
            console.log(result);
          },
            (e) => {
              console.log('Rejected', e);
            });
        });
    }

  }
}
