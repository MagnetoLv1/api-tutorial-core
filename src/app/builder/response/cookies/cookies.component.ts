import { Component, OnInit, Input } from '@angular/core';
import { IKeyvalue } from 'app/builder/request/interface/item';
import { Cookies } from 'electron';
import { log } from 'util';

@Component({
  selector: 'response-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class ResponseCookiesComponent implements OnInit {


  cookies: any;
  @Input() set headers(value){
    if(value && value['set-cookie']){
       this.parse(value['set-cookie']);
    }
  };
  constructor() { }

  ngOnInit() {
  }

  private parse(setCookies) {
    var cookies = [];
    console.log(setCookies);
    if (setCookies == undefined) {
      return;
    }
    for (var i=0; i < setCookies.length; i++) {
      var parts = setCookies[i].split('; ');
      var part0 = parts.shift();
      
      var item = part0.split('=');
      var cookie = {name:item[0],value: decodeURIComponent(item[1])}
      for (var j=0; j < parts.length; j++) {
        var item = parts[j].split('=');
        cookie[item[0]] = decodeURIComponent(item[1]);
      }
      cookies.push(cookie);
    }
    console.log(cookies);
    this.cookies = cookies;
  }
}
