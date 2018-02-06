import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class DragdropService {

  public dragElement: any;
  public item: any;
  public path: string;
  public index:Number;
  @Output() dragging:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

}
