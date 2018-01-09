import { Component, OnInit, Input } from '@angular/core';
import { Keyvalue } from 'app/models/item';

@Component({
  selector: 'response-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class ResponseHeadersComponent implements OnInit {

  @Input() headers: Array<Keyvalue>;;
  constructor() { }

  ngOnChanges(changes: {}) {
  }
  ngOnInit() {
  }


  
  get keys() {
    return this.headers?Object.keys(this.headers):[];
  }

  click(){
    console.log(this.headers);
  }
}
