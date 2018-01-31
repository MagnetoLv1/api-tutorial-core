import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @Input() version: string;
  @Input() url: string;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  constructor(private _electronService: ElectronService,) { }

  ngOnInit() {
  }

  onDownload(){
    this._electronService.shell.openExternal(this.url);
  }
  onClose(){
    this.close.emit();    
  }
}
