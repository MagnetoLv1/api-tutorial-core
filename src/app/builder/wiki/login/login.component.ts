import { Component } from '@angular/core';
import { DialogRef } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { WikiService } from 'app/services/wiki.service';
import { ToastrService } from 'ngx-toastr';

export class WikiModalContext extends BSModalContext {
}
@Component({
  selector: 'wiki-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class WikiLoginComponent {

  id: string = '';
  password: string = '';
  constructor(public dialog: DialogRef<WikiModalContext>, private wikiService: WikiService, private toastr: ToastrService) { }


  onClose() {
    this.dialog.close();
  }

  onWikiLogin() {
    this.wikiService.wikiLogin(this.id, this.password).then(() => {
      this.toastr.success("로그인 되었습니다.");
      this.dialog.close();
    }).catch(() => {
      this.toastr.error("입력한 비밀번호가 잘못되었습니다. 다시 시도하세요.");
    })

  }

}
