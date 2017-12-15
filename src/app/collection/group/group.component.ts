import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'collection-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  @Input() level: number = 0;
  @Input() item: Array<Object> = [];
  @Input() path: string;
  constructor() { }

  ngOnInit() {
  }

  get lineClass(): string {
    return this.level > 0 ? 'line' : 'ztree';
  }

}
