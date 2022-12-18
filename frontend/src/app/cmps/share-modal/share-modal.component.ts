import { MiniUser } from './../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  inputs: ['loggedinUser'],
  outputs: ['close']
})
export class ShareModalComponent implements OnInit {

  constructor() { }

  userService = inject(UserService);

  faX = faX;

  loggedinUser!: User;
  usersToSend: MiniUser[] = [];
  close = new EventEmitter();

  async ngOnInit() {
    console.log('loggedinUser', this.loggedinUser);
    this.usersToSend = await this.userService.getFollowings(this.loggedinUser.id);
    console.log('usersToSend', this.usersToSend);
  }

  onCloseModal() {
    this.close.emit();
    console.log('onCloseModal');
  }
}