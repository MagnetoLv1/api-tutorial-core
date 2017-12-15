import { Component, OnInit } from '@angular/core';
import { Broadcaster } from "ng2-broadcast";
import { CollectionService } from "app/services/collection.service";
import { IItem, IKeyvalue, IResponse, IBody, IRequest } from "./request/interface/item";


@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit {

  item: IItem;
  request: IRequest = <IRequest>{
    url: '',
    method: 'GET',
    body: {
      mode:'formdata',
      formdata: [{
      key: '',
      value: '',
      description: ''
    }],
      urlencoded: [{
      key: '',
      value: '',
      description: ''
    }],
    },
    header: [{
      key: '',
      value: '',
      description: ''
    }]
  };
  response: IResponse = <IResponse>{
    status: 0,
    statusText: '',
    headers: [],
    body: ''
  };
  constructor(private broadcaster: Broadcaster, private collectionService: CollectionService) {

    /**
    * 아이템을 선택했을 경우
    */
    this.broadcaster.on<string>('item')
      .subscribe((item: any) => {
        this.item = item;
        this.request = this.MergeRecursive(<IRequest>{
          url: '',
          method: 'GET',
          body: {
            formdata: [],
            urlencoded: [],
          },
          header: []
        }, JSON.parse(JSON.stringify(item.request)));
        this.addBlankInput(this.request, 'header');
        this.addBlankInput(this.request.body, 'formdata');
        this.addBlankInput(this.request.body, 'urlencoded');
      });
  }

  ngOnInit() {
  }


  onResponseChange(response: IResponse) {
    this.response = response;
  }

  onSaveEvent() {
    let request = JSON.parse(JSON.stringify(this.request));
    this.emptyDataRemove(request.body, 'urlencoded');
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
      parent[key] = new Array<IKeyvalue>();
    }
    let values = parent[key];
    values.push(<IKeyvalue>{
      key: '',
      value: '',
      description: ''
    });
  }


  emptyDataRemove(parent: any, key: string) {
    if (!parent[key]) {
      return;
    }
    let values: Array<IKeyvalue> = parent[key];
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

  isEmptyData(data: IKeyvalue) {
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
