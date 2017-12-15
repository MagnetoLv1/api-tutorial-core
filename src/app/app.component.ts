import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  size = [25, 75];
  constructor() {
  }

  ngOnInit() {
    if (localStorage.getItem('split-size')) {
      this.size = JSON.parse(localStorage.getItem('split-size'));
    }
  }

  onDragEnd($event) {
    console.log($event)

    localStorage.setItem('split-size', JSON.stringify($event));
  }
}
