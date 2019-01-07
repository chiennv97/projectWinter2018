import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import {UserIdService} from '../core/userId.service';

@Component({
  selector: 'page-user',
  templateUrl: 'order.component.html',
  styleUrls: ['order.css']
})
export class OrderComponent {

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  numberOfPrint = 1;
  file;
  name = '';
  page;
  price = 100;
  customerName = '';
  numberPhone = '';
  address = '';
  customers: AngularFireObject<any>;
  currentUser: Observable<any>;
  users$: AngularFireList<any>;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    public db: AngularFireDatabase,
    public userIdService: UserIdService
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
    console.log(this.userIdService.getUserId());
    this.customers = this.db.object('users/' + this.userIdService.getUserId());
    this.customers.snapshotChanges().subscribe(action => {
      console.log(action.payload.val());
      this.customerName = action.payload.val().customerName;
      this.numberPhone = action.payload.val().numberPhone;
      this.address = action.payload.val().address;
    });
    this.users$ = this.db.list('/users');
    // this.currentUser = this.customers.object('lCot8XRm2jNCYchutulTYL7ANIq2').valueChanges();

  }
  onSubmit(formFile) {
    console.log(formFile);
  }
  logNumberOfPrint() {
    console.log(this.numberOfPrint);
  }
  logEvent(event) {
    console.log(event);
    this.name = event.target.files[0].name;
    console.log(this.user);
    const reader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);
    // comment when run
    // const seft = this;
    // reader.onloadend = function() {
    //   const count = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
    //   seft.page = count;
    // };
  }
  createForm(name) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required ]
    });
  }

  save(value) {
    this.userService.updateCurrentUser(value)
    .then(res => {
      console.log(res);
    }, err => console.log(err));
  }

  logout() {
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log('Logout error', error);
    });
  }
  updateCustomerAddress() {
    this.customers.update({
      customerName: this.customerName,
      numberPhone: this.numberPhone,
      address: this.address
    });
    // this.users$.remove(this.userIdService.getUserId());
    // this.authService.updateCustomerAddress(this.userIdService.getUserId(), this.customerName, this.numberPhone, this.address);
  }
}
