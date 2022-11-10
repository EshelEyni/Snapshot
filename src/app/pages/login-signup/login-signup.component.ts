import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {

  constructor(private roter: Router) { }

  routerUrl: string = this.roter.url.slice(1)

  ngOnInit(): void {
  }

}
