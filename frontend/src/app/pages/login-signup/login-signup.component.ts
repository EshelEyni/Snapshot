import { AuthService } from './../../services/auth.service';
import { User } from './../../models/user.model';
import { LoadedLoggedInUser } from './../../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { State } from './../../store/store';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private store: Store<State>
  ) {
    this.form = this.fb.group({
      email: [''],
      fullname: [''],
      username: [this.routerUrl === 'login' ? 'test-user' : ''],
      password: [this.routerUrl === 'login' ? 'test-user' : ''],
    });
  }

  form!: FormGroup;
  routerUrl: string = this.router.url.slice(1);
  btnTxt: string = this.routerUrl === 'login' ? 'Login' : 'Signup';

  selectedAnimationImg: string = `../../../assets/imgs/animation-img-1.png`;
  intervalId!: number;
  imgCounter: number = 2;

  ngOnInit(): void {
    this.intervalId = window.setInterval(() => {
      this.selectedAnimationImg = `../../../assets/imgs/animation-img-${this.imgCounter}.png`;
      if (this.imgCounter === 4) this.imgCounter = 1;
      else this.imgCounter++;
    }, 2000);
  }

  async onLogin(): Promise<void> {
    const userCred = this.form.value;
    let loggedinUser: User;
    if (this.routerUrl === 'login') {
      const res = await this.authService.login({
        username: userCred.username,
        password: userCred.password,
      });
      if (!res) return;
      loggedinUser = res;
    } else {
      const res = await this.authService.signup(userCred);
      if (!res) return;
      loggedinUser = res;
    }

    this.store.dispatch(new LoadedLoggedInUser(loggedinUser));
    this.form.reset();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId!);
  }
}
