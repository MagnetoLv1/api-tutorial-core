import { Component, OnInit, HostListener, Input, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { Broadcaster } from 'ng2-broadcast';
import { ElectronService } from 'ngx-electron';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { RequestModalContext, EditComponent, MODE, TYPE } from '../edit/edit.component';
import { CollectionService } from "app/services/collection.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'collection-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() item: any;
  @Input() level: number;
  @Input() path: string;

  mouseover: boolean = false;
  open: boolean = false;
  @HostListener('mouseover')
  onMouseOver() {
    this.mouseover = true;
  }

  @Output() outEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  @HostListener('mouseout')
  onMouseOut() {
    this.mouseover = false;
  }
  ipcRenderer: Electron.IpcRenderer;
  menu: Electron.Menu;
  menuItem: Electron.MenuItem;

  constructor(private broadcaster: Broadcaster, private collectionService: CollectionService,
    private electronService: ElectronService, public modal: Modal, private toastr: ToastrService, ) {
    this.ipcRenderer = electronService.ipcRenderer;

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
    return this.item.request ? false : true;
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


  onEditClick($event) {

    this.modal.open(EditComponent, overlayConfigFactory({
      isBlocking: false,
      mode: MODE.CREATE,
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
    console.log(this.path);
    this.collectionService.slice(this.path).then(() => {
      this.toastr.info('삭제 되었습니다.');
    });

    $event.stopPropagation(); //이벤트가 부모로 올라가지 못하게
  }
}
