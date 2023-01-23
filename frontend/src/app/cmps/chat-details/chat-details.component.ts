import { Chat } from '../../models/chat.model';
import { User } from '../../models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss'],
  inputs: ['loggedinUser', 'chat'],
})
export class ChatDetailsComponent implements OnInit {

  constructor() { }

  loggedinUser!: User;
  chat!: Chat;
  imgUrlList!: string[];
  memberNameList!: string[];

  ngOnInit(): void {
    const { members } = this.chat;
    this.imgUrlList = members.map(m => m.imgUrl).slice(0, this.chat.isGroup ? 2 : 1);
    this.memberNameList = members.filter(u => u.id !== this.loggedinUser.id).map(m => m.fullname);

  }

}
