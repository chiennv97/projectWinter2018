import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.css']
})
export class UserComponent {

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  text = '';
  file;
  name = '';
  page;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {

  }
  onSubmit(formFile) {
    console.log(formFile);
  }
  logEvent(event) {
    console.log(event);
    this.name = event.target.files[0].name;
    console.log(this.name);
    const reader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);
    const seft = this;
    reader.onloadend = function() {
      const count = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
      seft.page = count;
    };
    // this.page = reader.onloadend;
    // console.log(reader.onloadend);
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
}
