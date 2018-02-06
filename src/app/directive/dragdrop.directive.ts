import { Directive, ElementRef, HostListener, Renderer, EventEmitter, Output, Input, Optional } from '@angular/core';
import { Item } from 'app/models/item';
import { setTimeout } from 'timers';
import { NgModel } from '@angular/forms';
import { DragdropService } from 'app/directive/dragdrop.service';

@Directive({
  selector: '[appDragdrop]',
  host: {
    '(drop)': 'onDrop($event)',
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
    //'(dragover)': 'onDragOver($event)',
    //'(dragenter)': 'onDragEnter($event)',
    //'(dragleave)': 'onDragLeave($event)',
  }

})
export class DragdropDirective {

  @Input() public item: any;
  @Input() public postition: number = 0;
  @Input() public appDragdrop: number = 0;
  constructor(private dragdropService: DragdropService, private el: ElementRef, private renderer: Renderer) {
  }

  drapElm: any;
  dragOverElm: any;
  static dragElement: any;
  static item: any;
  ondragexit(event) {
    console.log('ondragexit')
  }

  /*************************
   * drag 대상
   **********************/
  onDragStart(event) {

    this.dragdropService.dragging.emit(false);

    DragdropDirective.dragElement = event.currentTarget;
    DragdropDirective.item = this.item;
    //console.log('onDragStart', this.item.name)
    //console.log('onDragStart', event.currentTarget, this.el.nativeElement, event.currentTarget == this.el.nativeElement)
    event.stopPropagation();
    this.drapElm = event.currentTarget;
    //this.renderer.setElementClass(event.currentTarget, "drag", true);
    this.dragdropService.dragging.emit(true);
  }
  onDragEnd(event) {
    event.stopPropagation();
    if (this.drapElm) {
      //this.renderer.setElementClass(this.drapElm, "drag", false);
    }
    //this.removeDragOver(this.dragOverElm);
    this.dragdropService.dragging.emit(false);
  }

  /*************************
   * drop 대상
   **********************/
  onDragOver(event) {
    //필수 drop 이벤트가 발생시키려면 preventDefault 해줘야함


    // let postition = (event && (event.target.offsetHeight / 2) > event.layerY) ? 1 : -1;
    // if (postition != this.postition) {
    //   this.postition = postition;
    //   if (this.postition) {
    //     this.el.nativeElement.classList.add('is-drop-hovered-top')
    //   }
    //   else {
    //     this.el.nativeElement.classList.add('is-drop-hovered-bottom')
    //   }
    // }



    // setTimeout(() => {
    //   console.log(event.layerY, event);
    //   if (event && (event.target.offsetHeight / 2) > event.layerY) {
    //     if(this.el.nativeElement.classList.contains('is-drop-hovered-top')==false)
    //     {
    //       this.el.nativeElement.classList.add('is-drop-hovered-top')
    //     }

    //     console.log(this.el.nativeElement.classList.contains('is-drop-hovered-top'));
    //   } else {

    //     console.log(this.el.nativeElement.classList.contains('is-drop-hovered-top'));
    //     if (this.el.nativeElement.classList.contains('is-drop-hovered-bottom')==false) {
    //       this.el.nativeElement.classList.add('is-drop-hovered-bottom')
    //     }
    //   }
    // }, 1);
    event.preventDefault();
  }
  onDragEnter(event) {
    // console.log('onDragEnter', this.item, event.currentTarget, this.el.nativeElement, event.currentTarget == this.el.nativeElement)
    event.stopPropagation();
    this.dragOverElm = event.currentTarget;
    //this.renderer.setElementClass(this.el.nativeElement, "is-drop-hovered-top", true);
    this.el.nativeElement.classList.add('over')
  }

  onDragLeave(event) {
    event.stopPropagation();
    if (event.target == event.currentTarget) {
      return;
    }
    //this.el.nativeElement.classList.remove('is-drop-hovered-top');
    //this.el.nativeElement.classList.remove('is-drop-hovered-bottom');
    this.el.nativeElement.classList.remove('over')
    this.postition = -1;
    //this.renderer.setElementClass(this.el.nativeElement, "is-drop-hovered-top", false);
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