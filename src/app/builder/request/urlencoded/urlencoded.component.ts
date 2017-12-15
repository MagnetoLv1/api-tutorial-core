import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'request-urlencoded',
  templateUrl: './urlencoded.component.html',
  styleUrls: ['./urlencoded.component.css']
})
export class UrlencodedComponent implements OnInit {


  @Input() urlencoded: any;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Row 추가
   */
  addRow() {
    this.urlencoded.push({
      key: '',
      value: '',
      description: ''
    })
  }


  /**
   * 키가 눌러지면, Row 1개 생성
   * @param  
   * @param index 
   */
  onKeyDown($event, index) {
    if (index + 1 == this.urlencoded.length) {
      this.addRow();
    }
  }

  onDeleteClick(index) {
    this.urlencoded.splice(index, 1);
  }

}
