import { Chat } from './../models/chat.model';
import { User } from './../models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss'],
  inputs: ['loggedinUser','chat'],
})
export class ChatDetailsComponent implements OnInit {

  constructor() { }

  loggedinUser!: User;
  chat!: Chat;

  ngOnInit(): void {
  }

}
