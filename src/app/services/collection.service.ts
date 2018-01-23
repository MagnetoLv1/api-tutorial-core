import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map'
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { ElectronService } from 'ngx-electron';

@Injectable()
export class CollectionService {

  public modifier: string
  constructor(private http: Http, private _electronService: ElectronService) {
    this.modifier = Math.random().toString();

    this.init();
  }

  init() {
    let env = this._electronService.remote.process.env;
    firebase.initializeApp({
      apiKey: env.apiKey,
      authDomain: env.authDomain,
      databaseURL: env.databaseURL,
      projectId: env.projectId,
      storageBucket: env.storageBucket,
      messagingSenderId: env.messagingSenderId
    });

  }


  getItemListening(): Observable<Object> {
    const collectionSubject: Subject<Object> = new Subject<Object>();
    firebase.database().ref().on('value', (snapshot) => {
      collectionSubject.next(snapshot.val());
    });
    return collectionSubject.asObservable();
  }


  get(path): Observable<Object> {
    const collectionSubject: Subject<Object> = new Subject<Object>();
    var itemRef = firebase.database().ref(path).once('value').then((snapshot) => {
      collectionSubject.next(snapshot.val());
    });
    return collectionSubject.asObservable();
  }

  private _items: any = {};
  setItem(path: string, data: any) {
    this._items[path] = data;
    return this;
  }
  update(path?: string, data?: any): Promise<any> {

    let updates = {};
    if (arguments.length) {
      updates[path] = data;
    }
    //setItem 
    for (let key of Object.keys(this._items)) {
      updates[key] = this._items[key];
    }
    this._items = {};
    updates['modifier'] = this.modifier;
    updates['modify_date'] = (new Date()).getTime();
    return firebase.database().ref().update(updates);
  }

  delete(path): Promise<any> {
    return this.update(path, null);
  }



  remove(path): Promise<any> {
    return firebase.database().ref(path).remove();
  }

  /**
   * 
   */
  push(path, data: Object): Promise<any> {

    let ref: firebase.database.Reference = (!path) ? firebase.database().ref() : firebase.database().ref(path);


    return ref.child('item').orderByKey().limitToLast(1).once('value').then((snapshot) => {
      let val, index = 0;
      if (val = snapshot.val()) {
        let key = Object.keys(val)[0];
        index = parseInt(key) + 1;
      }
      path = (!path) ?
        ('item/' + index) :
        (path + '/item/' + index);
      return this.update(path, data);
    });
  }


}
