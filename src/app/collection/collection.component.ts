import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { RequestModalContext, EditComponent, MODE, TYPE } from './edit/edit.component';

import { CollectionService } from '../services/collection.service';
import { ElectronService } from 'ngx-electron';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  private collection: any = null;
  private selectItem: Object;


  constructor(private _electronService: ElectronService, private collectionService: CollectionService, private toastr: ToastrService, public modal: Modal) {

    var Notification = this._electronService.remote.Notification;

  }

  ngOnInit() {
    //변경 수신대기
    this.collectionService.getItemListening().subscribe((data: any) => {
      //최초에는 toastr 를 띄우지 않음(collection==null)
      if (this.collection != null
        && data.modifier != this.collectionService.modifier) {
        //  console.log('누군가 Collection을 업데이트 하였습니다.')

        const Notification = this._electronService.remote.Notification;
        const noti = new Notification({
          title: 'API Tutorial',
          body: '누군가 Collection을 업데이트 하였습니다.'
        });
        noti.show();
      }
      this.collection = data;
    },
      error => {
        console.log(error);
      });

  }
  setCollection(data) {
    this.collection = data;
  }



  onItemClick($event) {
    this.toastr.info('누군가 Collection을 업데이트 하였습니다.');
  }


  /**
   * 폴더 생성 다이얼로그 띄우기
   */
  onAddFolder() {

    this.modal.open(EditComponent, overlayConfigFactory({
      isBlocking: false,
      mode: MODE.CREATE,
      type: TYPE.FOLDER,
      path: 'api/item',
      item: this.collection.item
    },
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
