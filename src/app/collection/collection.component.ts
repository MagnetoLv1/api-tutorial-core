import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { RequestModalContext, EditComponent, MODE, TYPE } from './edit/edit.component';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { CollectionService } from '../services/collection.service';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  private collection: any = null;
  private selectItem: Object;

  constructor(private collectionService: CollectionService, private toastr: ToastrService, public modal: Modal) {
  }

  ngOnInit() {
    this.collectionService.test();
    //변경 수신대기
    this.collectionService.getItemListening().subscribe( (data: any)=> {
      //최초에는 toastr 를 띄우지 않음(collection==null)
      if (this.collection != null
        && data.modifier != this.collectionService.modifier) {
        //  console.log('누군가 Collection을 업데이트 하였습니다.')
        this.toastr.info('누군가 Collection을 업데이트 하였습니다.');
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
          () => {
            console.log('Rejected');
          });
      });
  }
}
