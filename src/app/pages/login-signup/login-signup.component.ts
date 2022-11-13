import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {

  intervalId!: number
  routerUrl: string = this.router.url.slice(1)
  imgCounter: number = 2
  selectedAnimationImg: string = `../../../assets/imgs/animation-img-1.png`
  form!: FormGroup

  constructor(private router: Router,
    private userService: UserService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      email: [''],
      fullname: [''],
      username: [''],
      password: ['']
    })
  }

  ngOnInit(): void {
    this.intervalId = window.setInterval(() => {
      this.selectedAnimationImg = `../../../assets/imgs/animation-img-${this.imgCounter}.png`
      if (this.imgCounter === 4) this.imgCounter = 1
      else this.imgCounter++
    }, 2000)
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId!)
  }

  onLogin() {
    const userCred = this.form.value
    if (this.routerUrl === 'login') this.userService.login({ username: userCred.username, password: userCred.password })
    else this.userService.signup(userCred)
    console.log(userCred)
    this.form.reset()
    this.router.navigate(['/'])
  }

}
