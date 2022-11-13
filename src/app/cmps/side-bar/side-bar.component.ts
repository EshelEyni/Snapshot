import { UserService } from './../../services/user.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  @Output() togglePostEdit = new EventEmitter<boolean>()

  constructor(private router: Router,
    private userService: UserService) { }

  username: string = ''

  async ngOnInit(): Promise<void> {
    const loggedinUser = await lastValueFrom(this.userService.getLoggedinUser())
    if(loggedinUser) this.username = loggedinUser.username
  }

  get isLoginSignupPath() {
    return !(this.router.url === '/login' || this.router.url === '/signup')
  }

  onTogglePostEdit() {
    this.togglePostEdit.emit(true)
  }
}
