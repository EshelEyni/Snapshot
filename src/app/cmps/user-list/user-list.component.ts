import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  constructor() { }

  @Input() users!: User[];
  // if there aren't enough users to fill the list, add dummy users like in instagram
  

  ngOnInit(): void {
  }

}
