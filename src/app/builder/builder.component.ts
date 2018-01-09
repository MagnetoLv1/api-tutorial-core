import { Component, OnInit } from '@angular/core';
import { Broadcaster } from "ng2-broadcast";
import { CollectionService } from "app/services/collection.service";
import { ItemRequest, Item, ItemResponse, Keyvalue, ContextType } from 'app/models/item';


@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit {

  item: Item = new Item('api','New Request');
  response:ItemResponse = new ItemResponse();
  constructor(private broadcaster: Broadcaster, private collectionService: CollectionService) {

    /**
    * 아이템을 선택했을 경우
    */
    this.broadcaster.on<string>('item')
      .subscribe((item: any) => {
        //Item 복제
        this.item = JSON.parse(JSON.stringify(item));

       // this.item.request = this.MergeRecursive(new ItemRequest(), JSON.parse(JSON.stringify(item.request)));



        this.addBlankInput(this.item.request, 'header');
        if(this.item.request.body){
          this.addBlankInput(this.item.request.body, 'formdata');
          this.addBlankInput(this.item.request.body, ContextType.urlencoded);
        }
      });
  }

  ngOnInit() {
  }


  onResponseChange(response: ItemResponse) {
    this.response = response;
  }

  onSaveEvent() {
    let request = JSON.parse(JSON.stringify(this.item.request));
    this.emptyDataRemove(request.body, ContextType.urlencoded);
    this.emptyDataRemove(request.body, 'formdata');
    this.emptyDataRemove(request, 'header');
    this.collectionService.update(this.item.path + '/request', request)
  }

  /**
   * 추가입력폼을 위한 빈값 추가
   * @param values 
   * 
   */
  addBlankInput(parent: any, key: string) {
    if (!parent[key]) {
      parent[key] = new Array<Keyvalue>();
    }
    let values = parent[key];
    values.push(new Keyvalue());
  }


  emptyDataRemove(parent: any, key: string) {
    if (!parent[key]) {
      return;
    }
    let values: Array<Keyvalue> = parent[key];
    let cnt = values.length;
    if (cnt == 0) {
      delete parent[key];
      return;
    }
    for (let i = cnt - 1; i >= 0; i--) {
      if (this.isEmptyData(values[i])) {
        values.splice(i, 1);
      }
    }
  }

  isEmptyData(data: Keyvalue) {
    if (!data.key && !data.value) {
      return true;
    }
    return false;
  }


  /**
   * Object 복사
   * @param obj1 
   * @param obj2 
   */
  MergeRecursive(obj1, obj2) {

    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p] = this.MergeRecursive(obj1[p], obj2[p]);

        } else {
          obj1[p] = obj2[p];

        }

      } catch (e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];

      }
    }

    return obj1;
  }
}
