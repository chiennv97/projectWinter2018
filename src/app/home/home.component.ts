import { Component, OnInit } from '@angular/core';
import {AuthService} from '../core/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  tryGoogleLogin() {
    this.authService.doGoogleLogin()
      .then(res =>{
          this.router.navigate(['/user']);
        }, err => console.log(err)
      );
  }
}
