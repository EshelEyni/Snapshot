import { MiniUser } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  inputs: ['users', 'type']
})
export class UserListComponent implements OnInit {

  constructor() { }

  users!: MiniUser[];
  type!: string;
  title: string = '';


  ngOnInit(): void {
    this.setTitle();

  }

  setTitle() {
    if (this.type === 'suggestion-list') this.title = 'Suggestion For You';
    else this.title = 'Users';
  }
}
