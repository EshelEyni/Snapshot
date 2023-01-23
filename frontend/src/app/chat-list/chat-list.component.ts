import { User } from './../models/user.model';
import { Chat } from './../models/chat.model';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  inputs: ['chats', 'loggedinUser'],
  outputs: ['chatSelected']
})

export class ChatListComponent implements OnInit {

  constructor() { }
  chatSelected = new EventEmitter<Chat>();

  chats!: Chat[];
  loggedinUser!: User;
  currActiveChatId!: number;

  ngOnInit(): void {
  }

  onSelectChat(chat: Chat) {
    this.currActiveChatId = chat.id;
    this.chatSelected.emit(chat);
  }
}