import { User } from './../models/user.model';
import { Chat } from './../models/chat.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chat-preview',
  templateUrl: './chat-preview.component.html',
  styleUrls: ['./chat-preview.component.scss'],
  inputs: ['chat', 'loggedinUser']
})
export class ChatPreviewComponent implements OnInit {

  constructor() { }

  chat!: Chat;
  loggedinUser!: User;
  imgUrlList!: string[];
  memberNameList!: string[];

  ngOnInit(): void {
    const { members } = this.chat;
    this.imgUrlList = members.map(m => m.imgUrl).slice(0, this.chat.isGroup ? 2 : 1);
    this.memberNameList = members.filter(u => u.id !== this.loggedinUser.id).map(m => m.fullname);
  }

}
