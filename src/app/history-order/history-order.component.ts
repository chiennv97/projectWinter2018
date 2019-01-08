import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import {FirebaseUserModel} from '../core/user.model';
import {UserService} from '../core/user.service';
import { Location } from '@angular/common';
import {AuthService} from '../core/auth.service';
@Component({
  selector: 'app-history-order',
  templateUrl: './history-order.component.html',
  styleUrls: ['./history-order.component.css']
})
export class HistoryOrderComponent implements OnInit {
  orders$: AngularFireList<any>;
  items: Observable<any[]>;
  user: FirebaseUserModel = new FirebaseUserModel();
  constructor(
    public db: AngularFireDatabase,
    public storage: AngularFireStorage,
    public userService: UserService,
    public authService: AuthService,
    private location: Location,
  ) {
    this.userService.getCurrentUser()
      .then(res => {
        if (res.providerData[0].providerId === 'password') {
          this.user.image = 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png';
          this.user.name = res.displayName;
          this.user.provider = res.providerData[0].providerId;
        } else {
          // console.log(order);
          this.user.image = res.photoURL;
          this.user.name = res.displayName;
          this.user.provider = res.providerData[0].providerId;
        }
      }, err => {
        // this.router.navigate(['/login']);
      });
    this.orders$ = this.db.list('/orders/' + this.getUserId());
    this.items = this.orders$.valueChanges();
  }

  ngOnInit() {
  }
  getUserId() {
    return localStorage.getItem('currentUserID');
  }
  logout() {
    this.authService.doLogout()
      .then((res) => {
        this.location.back();
      }, (error) => {
        console.log('Logout error', error);
      });
  }
}
