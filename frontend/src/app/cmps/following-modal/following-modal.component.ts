import { FollowService } from './../../services/follow.service';
import { MiniUser, User } from 'src/app/models/user.model';
import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'following-modal',
  templateUrl: './following-modal.component.html',
  styleUrls: ['./following-modal.component.scss'],
  outputs: ['close']
})
export class FollowingModalComponent implements OnInit {

  constructor() { };

  followService = inject(FollowService);
  
  faX = faX;
  
  users: MiniUser[] = [];

  close = new EventEmitter();

  async ngOnInit() {
    this.users = await this.followService.getFollowings();
  };

  onCloseModal(): void {
    this.close.emit();
  };
};