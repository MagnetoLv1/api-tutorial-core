import { Component, OnInit, Input } from '@angular/core';
import { ItemResponse, Item } from 'app/models/item';
import { CollectionService } from 'app/services/collection.service';


@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements  OnInit {

  private _body: String;
  display_response:string='body';
  @Input() item: Item;
  @Input() response: ItemResponse;
  constructor( private collectionService: CollectionService) { }

  get examples(){
    if(!this.item.response){
      this.item.response = new ItemResponse();
    }
    if(!this.item.response.examples){
      this.item.response.examples = []; 
    }
    return this.item.response.examples;
  }

  
  onResponseSaveEvent(example){
    console.log(this.item.path + '/response/examples', example);
    this.collectionService.push(this.item.path + '/response/examples',example);  
  }

  onResponseUpdateEvent(index){
    

  }


  get body() {
    return this.response.body;
  }

  get cookies() {
    return this.response.headers ? this.response.headers['Set-Cookie'] :{};
  }

  get headers() { 
    return this.response.headers;
  }


  ngOnInit() {
  }

}
