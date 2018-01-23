import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Keyvalue } from 'app/models/item';
import { extname } from 'path';
import { CollectionService } from 'app/services/collection.service';

@Component({
  selector: 'response-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css']
})
export class ResponseExamplesComponent implements OnInit {


  @Input() examples: any;
  @Input() path: string;
  selectIndex: number = 0;
  constructor(private collectionService: CollectionService) { }

  ngOnInit() {
  }

  get example(){

      if(this.examples.length>0){
          return this.examples[this.selectIndex];
      }
      return new Keyvalue();
  }
  get rows() {
    if(!this.example){
      return 10;
    }
    let matches = this.example.value.match(/\n/g);
    return matches ? matches.length + 3 : 10;
  }


  onDelete($event, index) {
    this.examples.split
    $event.stopPropagation(); //이벤트가 부모로 올라가지 못하게 
    console.log('onDelete', index)
    this.examples.splice(index, 1);
    let examples = JSON.parse(JSON.stringify(this.examples));
    this.collectionService.update(this.path + '/response/examples', examples);
  }

  onSave() {
    let example = JSON.parse(JSON.stringify(this.examples[this.selectIndex]));
    this.collectionService.update(this.path + '/response/examples/' + this.selectIndex, example);
  }
}
