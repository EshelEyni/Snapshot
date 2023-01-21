import { MiniUser, User } from 'src/app/models/user.model';
import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'followers-modal',
  templateUrl: './followers-modal.component.html',
  styleUrls: ['./followers-modal.component.scss'],
  inputs: ['loggedinUser'],
  outputs: ['close']
})

export class FollowersModalComponent implements OnInit {

  constructor() { }

  userService = inject(UserService);
  close = new EventEmitter();
  loggedinUser!: User;
  users: MiniUser[] = [];
  faX = faX;

  async ngOnInit() {
    this.users = await this.userService.getFollowers(this.loggedinUser.id);
  }

  onCloseModal() {
    this.close.emit();
  }
}