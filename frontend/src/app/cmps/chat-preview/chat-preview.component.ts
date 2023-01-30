import { User } from './../../models/user.model';
import { Chat } from './../../models/chat.model';
import { Component, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'chat-preview',
  templateUrl: './chat-preview.component.html',
  styleUrls: ['./chat-preview.component.scss'],
  inputs: ['chat', 'loggedinUser',]
})
export class ChatPreviewComponent implements OnInit, OnChanges {

  constructor() { };

  loggedinUser!: User;
  chat!: Chat;
  imgUrlList!: string[];
  memberNameList!: string[];

  ngOnInit(): void {
    const { members } = this.chat;
    const filteredMembers = members.filter(m => m.id !== this.loggedinUser.id);
    this.imgUrlList = filteredMembers.map(m => m.imgUrl).slice(0, this.chat.isGroup ? 2 : 1);
    this.memberNameList = filteredMembers.map(m => m.fullname);
  }

  ngOnChanges(): void {
    const { members } = this.chat;
    const filteredMembers = members.filter(m => m.id !== this.loggedinUser.id);
    this.imgUrlList = filteredMembers.map(m => m.imgUrl).slice(0, this.chat.isGroup ? 2 : 1);
    this.memberNameList = filteredMembers.map(m => m.fullname);
  };
};