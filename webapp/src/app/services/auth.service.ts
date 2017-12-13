import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class AuthService {
  public user: Observable<firebase.User>;
  public userDetails: firebase.User = null;
  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log(this.userDetails);
        }
        else {
          this.userDetails = null;
          this.signin();
        }
      }
    );
  }

  getToken() {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      console.log('getting token');
      this._firebaseAuth.authState.subscribe((userDetails) => {
        console.log('AAA', userDetails);
        if (userDetails) {
          userDetails.getIdToken().then(resolve);
        } else {
          reject('No user');
        }
      });
    }));
  }

  private signin() {
    return this._firebaseAuth.auth.signInWithRedirect(
      new firebase.auth.GoogleAuthProvider()
    );
  }
}
