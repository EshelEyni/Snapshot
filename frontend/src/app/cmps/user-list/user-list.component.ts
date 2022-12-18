import { MiniUser } from './../../models/user.model';
import { Component, OnInit, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  inputs: ['users', 'usersToSend', 'type'],
  outputs: ['addUser', 'removeUser']
})
export class UserListComponent implements OnInit, OnChanges {

  constructor() { }

  users!: MiniUser[];
  usersToSend!: MiniUser[];
  type!: string;
  title: string = '';

  isSelectUser: { userId: string, idx: number, isSelected: boolean }[] = [];
  addUser = new EventEmitter<MiniUser>();
  removeUser = new EventEmitter<MiniUser>();


  ngOnInit(): void {
    this.setTitle();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.users = this.users;

    if (this.type === 'share-modal') {
      this.setIsSelectUser();
    }

    if (changes['usersToSend']) {
      this.usersToSend = this.usersToSend;
      console.log('this.uersToSend', this.usersToSend);
    }

  }

  setIsSelectUser() {
    this.isSelectUser = this.users.map((user, idx) => {
      const isUserSelected = this.usersToSend.some((userToSend) => userToSend.id === user.id);
      return { userId: user.id, idx, isSelected: isUserSelected };
    });
  }

  onToggleSelectUser(idx: number) {
    this.isSelectUser[idx].isSelected = !this.isSelectUser[idx].isSelected;
    if (this.isSelectUser[idx].isSelected) {
      this.addUser.emit(this.users[idx]);
    } else {
      this.removeUser.emit(this.users[idx]);
    }
  }

  onRemoveUser(idx: number) {
    this.removeUser.emit(this.users[idx]);
  }


  setTitle() {
    switch (this.type) {
      case 'suggestion-list':
        this.title = 'Suggestion For You';
        break;
      case 'share-modal':
        this.title = 'Suggested';
        break;
      case 'followers-list':
        this.title = 'Followers';
        break;
      case 'followings-list':
        this.title = 'Followings';
        break;
      case 'search-list':
        this.title = 'Search Results';
        break;
      // case 'search-bar-list':
      // this.title = 'Search Results';
      // break;
      default:
        this.title = 'Users';
        break;
    }

  }
}
