import { MiniUser } from './../../models/user.model';
import { Component, OnInit, OnChanges } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  inputs: ['users', 'type']
})
export class UserListComponent implements OnInit, OnChanges {

  constructor() { }

  users!: MiniUser[];
  type!: string;
  title: string = '';


  ngOnInit(): void {
    this.setTitle();

  }

  ngOnChanges() {
    this.users = [...this.users];
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
      default:
        this.title = 'Users';
        break;
    }

  }
}
