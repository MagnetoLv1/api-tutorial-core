import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'request-raw',
  templateUrl: './raw.component.html',
  styleUrls: ['./raw.component.css']
})
export class RawComponent implements OnInit {

  
  @Input() raw: any;
  constructor() { }

  ngOnInit() {
  }

}
