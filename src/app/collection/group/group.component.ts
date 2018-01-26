import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'collection-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  @Input() item: Array<Object> = [];
  @Input() path: string;
  constructor() { }

  ngOnInit() {
  }


  keys(){
    return Object.keys(this.item);
  }

  get itemValue(){
    return Object.values(this.item);
  }

  onItemDrop(event){
    event.preventDefault();
    event.stopPropagation();
    console.log('onItemDrop',this.path, event.detail)
  }

  onItemDrag(event){
    event.preventDefault();
    event.stopPropagation();
    console.log('onItemDrag',this.path, event.detail)
  }

}
