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
  users: MiniUser[] = [];
  usersToSend: MiniUser[] = [];
  close = new EventEmitter();

  async ngOnInit() {
    this.users = await this.userService.getFollowings(this.loggedinUser.id);
  }

  onAddUser(user: MiniUser) {
    this.usersToSend.push(user);
  }

  onRemoveUser(user: MiniUser) {
    const idx = this.usersToSend.findIndex(currUser => currUser.id === user.id);
    this.usersToSend.splice(idx, 1);
  }

  onCloseModal() {
    this.close.emit();
  }

  onSend() {
    console.log('onSend');
  }

}