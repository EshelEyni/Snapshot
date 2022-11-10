import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {

  constructor(private router: Router) { }

  intervalId!: number
  routerUrl: string = this.router.url.slice(1)
  imgCounter: number = 1
  selectedAnimationImg: string = ''


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

}
