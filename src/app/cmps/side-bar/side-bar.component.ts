import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor(private router: Router) { }
  faHome = faHome;

  ngOnInit(): void {
  }

  get isLoginSignupPath() {
    return !(this.router.url === '/login' || this.router.url === '/signup')
  }

}
