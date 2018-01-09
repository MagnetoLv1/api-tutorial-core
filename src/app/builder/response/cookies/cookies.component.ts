import { Component, OnInit, Input } from '@angular/core';
import { Cookies } from 'electron';
import { log } from 'util';
import { CookieUtil } from 'app/utils/cookie';

@Component({
  selector: 'response-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class ResponseCookiesComponent implements OnInit {


  cookies: any;
  @Input() set headers(value){
    if(value && value['set-cookie']){
       this.cookies = CookieUtil.parse(value['set-cookie']);
    }
  };
  constructor() { }

  ngOnInit() {
  }

}
