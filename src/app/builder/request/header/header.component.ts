import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'request-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


   @Input() header: any;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Row 추가
   */
  addRow() {
    this.header.push({
      key: '',
      value: '',
      description: '',
      type: 'text'
    })
  }


  /**
   * 키가 눌러지면, Row 1개 생성
   * @param  
   * @param index 
   */
  onKeyDown($event, index) {
    if (index + 1 == this.header.length) {
      this.addRow();
    }
  }

  onDeleteClick(index) {
    this.header.splice(index, 1);
  }
}
