import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, UrlSerializer } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//module
import { NgxElectronModule } from 'ngx-electron';
import { Broadcaster } from 'ng2-broadcast';
import { AngularSplitModule } from 'angular-split'; //화면 slipt         
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { PrettyJsonModule, SafeJsonPipe } from 'angular2-prettyjson';   //Json Prtty 
import { ToastrModule } from 'ngx-toastr';


import { AppComponent } from './app.component';
import { CollectionService } from './services/collection.service';
import { FilesystemService } from './services/filesystem.service';
import { SendService } from './services/send.service';
import { NativeRequestService } from "./services/native-request.service";
import { CollectionComponent } from './collection/collection.component';
import { ItemComponent } from './collection/item/item.component';
import { RequestComponent } from './builder/request/request.component';
import { ResponseComponent } from './builder/response/response.component';
import { FormdataComponent } from './builder/request/formdata/formdata.component';
import { UrlencodedComponent } from './builder/request/urlencoded/urlencoded.component';
import { JsonPipe } from '@angular/common';
import { BodyComponent } from './builder/response/body/body.component';
import { WebviewDirective } from './directive/webview.directive';
import { GroupComponent } from './collection/group/group.component';
import { BuilderComponent } from './builder/builder.component';
import { EditComponent } from './collection/edit/edit.component';
import { HeaderComponent } from './builder/request/header/header.component';
import { RawComponent } from './builder/request/raw/raw.component';




@NgModule({
  declarations: [
    AppComponent,
    CollectionComponent,
    ItemComponent,
    RequestComponent,
    ResponseComponent,
    FormdataComponent,
    UrlencodedComponent,
    BodyComponent,
    WebviewDirective,
    GroupComponent,
    BuilderComponent,
    EditComponent,
    HeaderComponent,
    RawComponent

  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    NgxElectronModule,
    NgbModule.forRoot(),
    PrettyJsonModule,
    AngularSplitModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    ToastrModule.forRoot(), // ToastrModule added
    BrowserAnimationsModule,// required animations module
  ],
  providers: [CollectionService, SendService, NativeRequestService, FilesystemService, JsonPipe, SafeJsonPipe, Broadcaster],
  bootstrap: [AppComponent],
  entryComponents: [EditComponent]
})
export class AppModule { }
