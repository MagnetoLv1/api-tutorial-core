import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { RequestModalContext, EditComponent, MODE, TYPE } from './edit/edit.component';

import { CollectionService } from '../services/collection.service';
import { ElectronService } from 'ngx-electron';
import { ElementRef } from '@angular/core/src/linker/element_ref';
import { DragdropService } from 'app/directive/dragdrop.service';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  private selectItem: Object;
  public collection: any = null;


  private dragIndex;
  private isDragInProgress:Boolean =false;
  constructor(private _electronService: ElectronService,
    private collectionService: CollectionService,
    private toastr: ToastrService,
    private dragdropService:DragdropService,
    public modal: Modal) {

    var Notification = this._electronService.remote.Notification;
  }


  /**
   * collection의  item을 경로로 가져오기
   */
  private getDepthItem(item, paths) {
    if (typeof paths === 'string') {
      paths = paths.split('/');
    }
    let path = paths.shift();
    if (paths.length) {
      return this.getDepthItem(item[path], paths);
    } else {
      return item[path];
    }
  }

  private domIndexOf(child, parent) {
    return Array.prototype.indexOf.call(parent.children, child);
  };


  private switchItem(dragElm: any, dropGroupElm: any, dragGroupElm: any) {

    // let dropParnetPath = dropGroupElm.parentElement.dataset.path;
    // let dragParnetPath = dragGroupElm.parentElement.dataset.path;
    // var dropGroup = this.getDepthItem(this.collection, dropParnetPath);
    // var dragGroup = this.getDepthItem(this.collection, dragParnetPath);



    // let dropIndex = this.domIndexOf(dragElm, dropGroupElm);
    // let keys = Object.keys(dragGroup);
    // let dragItem = dragGroup[keys[this.dragIndex]];


    // console.log('b', dropGroup);

    // //추가
    // let newGroup = Object.values(dropGroup);
    // newGroup.splice(dropIndex, 0, dragItem);


    // console.log('a', newGroup);

    // //drap한 item (삭제됨)
    // let dragItemPath = dragElm.dataset.path;
    // //삭제


    // console.log(dragItemPath);
    // console.log(dropParnetPath, newGroup);
    // if (dropGroupElm && dragGroupElm) {

    //   newGroup.splice(this.dragIndex, 1);

    //   this.collectionService
    //     .setItem(dropParnetPath, newGroup)
    //     .update();

    // } else {
    //   this.collectionService
    //     .setItem(dragItemPath, null)
    //     .setItem(dropParnetPath, newGroup)
    //     .update();

    // }

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
      console.log(this.collection, data);
      this.collection = data;
      console.log(this.collection);
    },
      error => {
        console.log(error);
      });

      
    this.dragdropService.dragging.subscribe(isDragging => {
      console.log('isDragging',isDragging)
      this.isDragInProgress = isDragging;
    })

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
      path: '',
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
  
  onDrop(){
    console.log('dropdropdropdropdropdropdropdropdrop')
  }

  onDragging(){
    console.log('onDraggingonDraggingonDragging')
  }
}
