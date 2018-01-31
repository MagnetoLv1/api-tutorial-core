import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Menu, MenuItem } from 'electron';

@Injectable()
export class MenuService {

  private menu: Menu;
  constructor(private _electronService: ElectronService) {
    this.menu = this._electronService.remote.Menu.getApplicationMenu();
  }


  getMenu() {
    return this.menu;
  }

  append(menuItem: MenuItem) {
    this.menu.append(menuItem);
    this._electronService.remote.Menu.setApplicationMenu(this.menu);
  }

  remove(label) {
    let newMenu = new this._electronService.remote.Menu();

    let items = this.menu.items.filter((item) => {
      return item.label != label;
    });

    for (let item of items) {
      newMenu.append(item);
    }
    this.menu = newMenu;
    this._electronService.remote.Menu.setApplicationMenu(newMenu);
  }



  checkItem(label) {
    for (let item of this.menu.items) {
      console.log(label, item.label, label == item.label)
      if (label == item.label) {
        return true;
      }
    }
    return false;
  }


}
