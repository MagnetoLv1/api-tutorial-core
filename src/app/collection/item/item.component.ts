import { Component, OnInit, HostListener, Input, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { Broadcaster } from 'ng2-broadcast';
import { ElectronService } from 'ngx-electron';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { RequestModalContext, EditComponent, MODE, TYPE } from '../edit/edit.component';
import { CollectionService } from "app/services/collection.service";
import { ToastrService } from "ngx-toastr";
import { ItemDropEmit } from 'app/directive/dragdrop.directive';

@Component({
  selector: 'collection-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() item: any;
  @Input() path: string;
  @Input() index: Number = 0;

  hover: boolean = false;
  open: boolean = false;
  @Output() outEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private broadcaster: Broadcaster, private collectionService: CollectionService,
    private electronService: ElectronService, public modal: Modal, private toastr: ToastrService) {

  }


  onDragEnter(event,aaa) {
     //console.log('onDragEnteronDragEnter', this.path)

  }
  onDragLeave(event,aaa){
     // console.log('onDragLeaveonDragLeaveonDragLeaveonDragLeave', this.path)
  }

  ngOnInit() {
    this.open = this.openState;
  }


  onItemClick($event) {
    if (this.isFolder()) {
      this.open = !this.open
      this.openState = this.open;
    }
    else {
      this.item.path = this.path;
      this.broadcaster.broadcast('item', this.item);
    }
    $event.stopPropagation(); //이벤트가 부모로 올라가지 못하게
  }

  public onContextMenu($event: MouseEvent, item: any): void {
  }


  get folderClass(): string {
    return this.open ? 'ico_open' : 'ico_close';
  }

  get itemClass(): string {
    return this.isFolder() ? this.folderClass : 'ico_docu';
  }


  get subItem(): Array<Object> {
    return this.item.item ? this.item.item : [];
  }

  get pointClass(): string {
    return this.open ? 'roots_open' : 'roots_close'
  }

  get nodeClass(): string {
    return this.isFolder() ? this.pointClass : 'center_docu';
  }


  isFolder(): boolean {
    return this.item && this.item.request ? false : true;
  }

  /**
   * 열려있었는지 상태값
   */
  private get openState(): boolean {
    return localStorage.getItem(this.path) == 'true';
  }
  private set openState(state: boolean) {
    localStorage.setItem(this.path, state.toString());
  }

  @Output('itemdrop') onItemDrop = new EventEmitter<ItemDropEmit>();
  onAddlick($event) {
    console.log('onAddlick');
    this.onItemDrop.emit(new ItemDropEmit(1));
    return;
    console.log(this.path, this.path.length, MODE.CREATE);
    this.modal.open(EditComponent, overlayConfigFactory({
      isBlocking: false,
      mode: MODE.CREATE,
      type: TYPE.REQUEST,
      path: this.path,
      item: [],
    },
      BSModalContext)).then((resultPromise) => {
        return resultPromise.result.then((result) => {
          console.log(result);
        },
          () => {
            console.log('Rejected');
          });
      });
    $event.stopPropagation(); //이벤트가 부모로 올라가지 못하게

  }

  onEditClick($event) {
    this.modal.open(EditComponent, overlayConfigFactory({
      isBlocking: false,
      mode: MODE.UPDATE,
      type: this.isFolder() ? TYPE.FOLDER : TYPE.REQUEST,
      path: this.path,
      item: this.item,
    },
      BSModalContext)).then((resultPromise) => {
        return resultPromise.result.then((result) => {
          console.log(result);
        },
          () => {
            console.log('Rejected');
          });
      });
    $event.stopPropagation(); //이벤트가 부모로 올라가지 못하게
  }

  onDeleteClick($event) {

    if (confirm(`[${this.item.name}]를 삭제하시겠습니까?`)) {
      this.collectionService.remove(this.path).then(() => {
        this.toastr.info('삭제 되었습니다.');
      }).catch((error) => {
        this.toastr.error(`삭제시 오류가 발생하였습니다.\n[${error.message}]`)
      });
    }
    $event.stopPropagation(); //이벤트가 부모로 올라가지 못하게
  }

  onMouseenter($eve) {
    this.hover = true;
  }
  onMouseleave() {
    this.hover = false;
  }

  onDrop(){
    console.log('dropdropdropdropdropdropdropdropdrop')
  }
  onOver(){
    console.log('onOveronOveronOveronOveronOveronOveronOveronOver')

  }
}
