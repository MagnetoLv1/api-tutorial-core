import { Directive, ElementRef, HostListener, Renderer, EventEmitter, Output, Input } from '@angular/core';
import { Item } from 'app/models/item';

@Directive({
  selector: '[appDragdrop]',
  host: {
    '(drop)': 'onDrop($event)',
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
    '(dragover)': 'onDragOver($event)',
    '(dragenter)': 'onDragEnter($event)',
    '(dragleave)': 'onDragLeave($event)',
  }

})
export class DragdropDirective {

  @Input() public item: any;
  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  drapElm: any;
  dragOverElm: any;
  position: Boolean = false;
  static dragElement: any;
  static item: any;
  ondragexit(event) {
    console.log('ondragexit')
  }

  /*************************
   * drag 대상
   **********************/
  onDragStart(event) {


    DragdropDirective.dragElement = event.currentTarget;
    DragdropDirective.item = this.item;
    console.log('onDragStart', this.item.name)
    //console.log('onDragStart', event.currentTarget, this.el.nativeElement, event.currentTarget == this.el.nativeElement)
    event.stopPropagation();
    this.drapElm = event.currentTarget;
    this.renderer.setElementClass(event.currentTarget, "drag", true);
  }
  onDragEnd(event) {
    console.log('onDragEnd')
    event.stopPropagation();
    if (this.drapElm) {
      this.renderer.setElementClass(this.drapElm, "drag", false);
    }
    this.removeDragOver(this.dragOverElm);
  }

  /*************************
   * drop 대상
   **********************/
  onDragOver(event) {
    //필수 drop 이벤트가 발생시키려면 preventDefault 해줘야함
    event.preventDefault();
  }
  onDragEnter(event) {
    // console.log('onDragEnter', this.item, event.currentTarget, this.el.nativeElement, event.currentTarget == this.el.nativeElement)
    event.stopPropagation();
    this.dragOverElm = event.currentTarget;
    //this.el.nativeElement.classList.add('dragenter')
    this.renderer.setElementClass(this.el.nativeElement, "dragenter", true);

  }

  onDragLeave(event) {
    event.stopPropagation();
    if (event.target == event.currentTarget) {
      return;
    }
    //this.el.nativeElement.classList.remove('dragenter');
    this.renderer.setElementClass(this.el.nativeElement, "dragenter", false);
  }

  onDrop(event) {
    event.stopPropagation();

    this.el.nativeElement.classList.remove('dragenter');
    console.log('onDrop', this.el.nativeElement, this.el.nativeElement.parentElement.parentElement, DragdropDirective.dragElement.parentElement.parentElement)
    let dropIndex = this.el.nativeElement.dataset['index'];
    let dragIndex = DragdropDirective.dragElement.dataset['index'];
    //drap & drop 그룹이 같음
    if (this.el.nativeElement.parentElement.parentElement == DragdropDirective.dragElement.parentElement.parentElement) {

      let dropEvent = new CustomEvent('itemDrop', {
        bubbles: true, detail: {
          dropIndex: parseInt(dropIndex),
          dropItem: DragdropDirective.item,
          dragIndex: parseInt(dragIndex),
        }
      });
      this.renderer.invokeElementMethod(this.el.nativeElement, 'dispatchEvent', [dropEvent]);
    } else {
      console.log(this.el.nativeElement)
      let dropEvent = new CustomEvent('itemDrop', {
        bubbles: true, detail: {
          dropIndex: parseInt(dropIndex),
          dropItem: DragdropDirective.item,
          dragIndex: -1,
        }
      });
      this.renderer.invokeElementMethod(this.el.nativeElement, 'dispatchEvent', [dropEvent]);

      let dragEvent = new CustomEvent('itemDrag', {
        bubbles: true, detail: {
          dragIndex: parseInt(dragIndex),
        }
      });
      this.renderer.invokeElementMethod(DragdropDirective.dragElement, 'dispatchEvent', [dragEvent]);
    }
  }


  private removeDragOver(elm) {
    if (elm) {
      this.renderer.setElementClass(elm, "dragenter", false);
    }

  }
}
export class ItemDropEmit {
  constructor(
    public dropIndex,
    public item: Item = null,
    public dragIndex = -1) {
  }
}