import { UserService } from './../../services/user.service'
import { Router } from '@angular/router'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit, OnDestroy {
  intervalId!: number
  routerUrl: string = this.router.url.slice(1)
  btnTxt: string = this.routerUrl === 'login' ? 'Login' : 'Signup'
  imgCounter: number = 2
  selectedAnimationImg: string = `../../../assets/imgs/animation-img-1.png`
  form!: FormGroup

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      email: [''],
      fullname: [''],
      username: [''],
      password: [''],
    })
  }

  ngOnInit(): void {
    this.intervalId = window.setInterval(() => {
      this.selectedAnimationImg = `../../../assets/imgs/animation-img-${this.imgCounter}.png`
      if (this.imgCounter === 4) this.imgCounter = 1
      else this.imgCounter++
    }, 2000)
  }

  async onLogin() {
    const userCred = this.form.value
    if (this.routerUrl === 'login') {
      await this.userService.login({
        username: userCred.username,
        password: userCred.password,
      })
    } else {
      await this.userService.signup(userCred)
    }
    this.form.reset()
    this.router.navigate(['/'])
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId!)
  }
}
