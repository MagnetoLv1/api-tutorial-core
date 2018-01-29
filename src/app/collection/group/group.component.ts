import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { CollectionService } from 'app/services/collection.service';

@Component({
  selector: 'collection-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  @Input() item: Array<Object> = [];
  @Input() path: string;
  constructor(, private collectionService: CollectionService) { }

  ngOnInit() {
  }


  keys() {
    return Object.keys(this.item);
  }

  get itemValue() {
    return Object.values(this.item);
  }

  onItemDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    // 삭제
    if (event.detail.dragIndex >= 0 && event.detail.dropIndex < event.detail.dragIndex) {
      this.item.splice(event.detail.dragIndex, 1);
    }
    if (event.detail.dropIndex >= 0 && event.detail.dropItem) {
      this.item.splice(event.detail.dropIndex, 0, event.detail.dropItem);
    }
    //삭제
    if (event.detail.dragIndex >= 0 && event.detail.dropIndex > event.detail.dragIndex) {
      this.item.splice(event.detail.dragIndex, 1);
    }


    this.collectionService
      .update(this.path, this.item)


  }

  onItemDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.detail.dragIndex >= 0) {
      this.item.splice(event.detail.dragIndex, 1);

      this.collectionService
        .update(this.path, this.item)
    }
  }

}
