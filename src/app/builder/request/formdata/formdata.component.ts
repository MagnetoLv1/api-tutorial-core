import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'request-formdata',
  templateUrl: './formdata.component.html',
  styleUrls: ['./formdata.component.css']
})
export class FormdataComponent implements OnInit {

   @Input () formdata: any;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Row 추가
   */
  addRow() {
    this.formdata.push({
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
    if (index + 1 == this.formdata.length) {
      this.addRow();
    }
  }

  onDeleteClick(index) {
    this.formdata.splice(index, 1);
  }
}
