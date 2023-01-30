import { MiniUser, User } from 'src/app/models/user.model';
import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'followers-modal',
  templateUrl: './followers-modal.component.html',
  styleUrls: ['./followers-modal.component.scss'],
  inputs: ['user'],
  outputs: ['close']
})

export class FollowersModalComponent implements OnInit {

  constructor() { };

  userService = inject(UserService);
  
  faX = faX;
  
  user!: User;
  users: MiniUser[] = [];
  
  close = new EventEmitter();
  
  async ngOnInit(): Promise<void> {
    this.users = await this.userService.getFollowers(this.user.id);
  };

  onCloseModal() : void{
    this.close.emit();
  };
};