import { Component, OnInit } from '@angular/core';
import { DialogRef } from 'angular2-modal';

@Component({
  selector: 'body-save-prompt',
  templateUrl: './save.prompt.component.html',
  styleUrls: ['./save.prompt.component.css']
})
export class BodySavePromptComponent implements OnInit {

  title:String;
  constructor(public dialog: DialogRef<void>) { }

  ngOnInit() {
  }

  onClose() {
    this.dialog.close();
  }

  onSave() {
    this.dialog.close(this.title);
  }
}
