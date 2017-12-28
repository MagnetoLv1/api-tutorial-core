import { Component, OnInit, Input } from '@angular/core';
import { IKeyvalue } from 'app/builder/request/interface/item';

@Component({
  selector: 'response-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class ResponseHeadersComponent implements OnInit {

  @Input() headers: Array<IKeyvalue>;;
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
