import { FollowService } from './../../services/follow.service';
import { MiniUser, User } from 'src/app/models/user.model';
import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'followers-modal',
  templateUrl: './followers-modal.component.html',
  styleUrls: ['./followers-modal.component.scss'],
  inputs: ['userId'],
  outputs: ['close'],
})
export class FollowersModalComponent implements OnInit {
  constructor() {}

  followService = inject(FollowService);

  faX = faX;

  users: MiniUser[] = [];
  userId!: number;

  close = new EventEmitter();

  async ngOnInit(): Promise<void> {
    this.users = await this.followService.getFollowers(this.userId);
  }

  onCloseModal(): void {
    this.close.emit();
  }
}
