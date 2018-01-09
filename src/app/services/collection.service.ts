import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map'
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CollectionService {

  public modifier: string
  constructor(private http: Http) {
    this.modifier = Math.random().toString();

    this.init();
  }

  init(){
    /*
    firebase.initializeApp({
      apiKey: "AIzaSyCJLpKoVeOSlUsVquDyR9o4DQT7hg6Br4o",
      authDomain: "test-b8174.firebaseapp.com",
      databaseURL: "https://test-b8174.firebaseio.com",
      projectId: "test-b8174",
      storageBucket: "apiviewer.appspot.com",
      messagingSenderId: "293629322300"
    });
    */
    firebase.initializeApp({
      apiKey: "AIzaSyBM_wKB_LYG2bdF-iFYaIaFHNcgetNCFPI",
      authDomain: "apiviewer.firebaseapp.com",
      databaseURL: "https://apiviewer.firebaseio.com",
      projectId: "apiviewer",
      storageBucket: "apiviewer.appspot.com",
      messagingSenderId: "293629322300"
    });
    firebase.database().ref('/api').once('value').then((snapshot) => {
      var data = snapshot.val();
      if(data == null){
        //init        
        firebase.database().ref().update({
          'api/modifier':Math.random().toString(),
          'api/modify_date': (new Date()).getTime()
        })
      }
    });

    
  }


  getItemListening(): Observable<Object> {
    const collectionSubject: Subject<Object> = new Subject<Object>();
    var itemRef = firebase.database().ref('/api');
    itemRef.on('value', (snapshot) => {
      collectionSubject.next(snapshot.val());
    });
    return collectionSubject.asObservable();
  }


  update(path, item): Promise<any> {

    let updates = {}
    updates[path] = item;
    updates['api/modifier'] = this.modifier;
    updates['api/modify_date'] = (new Date()).getTime();
    return firebase.database().ref().update(updates);
  }

  delete(path): Promise<any> {
    return this.update(path, null);
  }


  /**
   * 배열 형식인 경우 index 유지를 위해 delete 가닌 slice 를 사용한다
   * @param path 
   */
  slice(path): Promise<any> {

    let p = path.split('/');
    let index = p.pop();
    let parentPath = p.join('/');

    return firebase.database().ref(parentPath).once('value').then((snapshot) => {
      var data = snapshot.val();
      data.splice(index, 1);  //아이템 삭제
      return this.update(parentPath, data);
    });
  }

  push(path, data: Object): Promise<any> {

    return firebase.database().ref(path).once('value').then((snapshot) => {
      let cnt = snapshot.val()?snapshot.val().length:0;
      path = path + '/' + cnt;
      console.log(path, data)
      return this.update(path, data);
    });
  }


}
