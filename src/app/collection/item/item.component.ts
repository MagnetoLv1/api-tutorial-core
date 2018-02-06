import { Component, OnInit, HostListener, Input, EventEmitter, Output, ViewContainerRef, ElementRef, Renderer, ViewChild } from '@angular/core';
import { Broadcaster } from 'ng2-broadcast';
import { ElectronService } from 'ngx-electron';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { RequestModalContext, EditComponent, MODE, TYPE } from '../edit/edit.component';
import { CollectionService } from "app/services/collection.service";
import { ToastrService } from "ngx-toastr";
import { ItemDropEmit } from 'app/directive/dragdrop.directive';
import { DragdropService } from 'app/directive/dragdrop.service';

@Component({
  selector: 'collection-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() item: any;
  @Input() path: string;
  @Input() index: number = 0;

  hover: boolean = false;
  open: boolean = false;
  postition: Number = 0;
  @Output() outEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('listitem') listitem: ElementRef;
  constructor(private el: ElementRef, private renderer: Renderer, private broadcaster: Broadcaster, private collectionService: CollectionService,
    private electronService: ElectronService, private dragdropService: DragdropService, public modal: Modal, private toastr: ToastrService) {

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

  onMouseenter(event) {
    event.stopPropagation();
    this.hover = true;
  }
  onMouseleave(event) {
    event.stopPropagation();
    this.hover = false;
  }




  onDragStart(event) {
    //console.log('onDragStart', this.item.name)
    event.stopPropagation();
    this.listitem.nativeElement.classList.add('drag-src');
    this.dragdropService.dragElement = event.currentTarget;
    this.dragdropService.item = this.item;
    this.dragdropService.path = this.path;
    this.dragdropService.index = this.index;
    this.dragdropService.dragging.emit(true);
  }
  onDragEnd(event) {
    console.log('onDragEnd')
    event.stopPropagation();
    this.listitem.nativeElement.classList.remove('drag-src');
    this.dragdropService.dragging.emit(false);
  }


  onDragOver(event, insertionPoint: string) {
    //필수 drop 이벤트가 발생시키려면 preventDefault 해줘야함
    event.preventDefault();

  }

  onDrop(event, insertionPoint: string) {

    this.dragdropService.dragging.emit(false);
    //전후 위치
    let position:number = (insertionPoint == 'before') ? 0 : 1;
    let dropIndex, dragIndex;
    if (this.getParentPath(this.dragdropService.path) == this.getParentPath(this.path)) {
      
      let dropEvent = new CustomEvent('itemDrop', {
        bubbles: true, detail: {
          dropIndex: (this.index + position),
          dropItem: this.dragdropService.item,
          dragIndex: this.dragdropService.index,
        }
      });
      this.renderer.invokeElementMethod(this.el.nativeElement, 'dispatchEvent', [dropEvent]);
    } else {
      let dropEvent = new CustomEvent('itemDrop', {
        bubbles: true, detail: {
          dropIndex: this.index,
          dropItem: this.dragdropService.item,
          dragIndex: -1,
        }
      });
      this.renderer.invokeElementMethod(this.el.nativeElement, 'dispatchEvent', [dropEvent]);

      let dragEvent = new CustomEvent('itemDrag', {
        bubbles: true, detail: {
          dragIndex: this.dragdropService.index,
        }
      });
      this.renderer.invokeElementMethod(this.dragdropService.dragElement, 'dispatchEvent', [dragEvent]);
    }

  }

  onDragEnter(event, insertionPoint: string) {
    this.renderer.setElementClass(event.target, "over", true);
  }
  onDragLeave(event, insertionPoint: string) {
    this.renderer.setElementClass(event.target, "over", false);
  }


  private getParentPath(path) {
    let paths = path.split('/');
    paths.pop();
    return paths.join('/');
  }



}
