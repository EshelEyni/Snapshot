import { User } from './../../models/user.model';
import { Chat } from './../../models/chat.model';
import { Component, OnInit, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  inputs: ['chats', 'loggedinUser', 'type', 'selectedChats'],
  outputs: ['chatSelected', 'addChat', 'removeChat']
})

export class ChatListComponent implements OnInit, OnChanges {

  constructor() { }
  chatSelected = new EventEmitter<Chat>();
  addChat = new EventEmitter<Chat>();
  removeChat = new EventEmitter<Chat>();

  chats!: Chat[];
  selectedChats!: Chat[];
  loggedinUser!: User;
  currActiveChatId!: number;
  type!: string;
  isSelectChat: { [key: number]: boolean } = {};

  ngOnInit(): void {
    if (this.type === 'share-modal') {
      this.chats.forEach(chat => {
        this.isSelectChat[chat.id] = false;
      })
    }
  }

  ngOnChanges() {
    if (this.type === 'share-modal') {
      this.chats.forEach(chat => {
        this.isSelectChat[chat.id] = this.selectedChats.some(selectedChat => selectedChat.id === chat.id);
      })
    }
  }

  setTitleForSearchBar(chat: Chat) {
    if (chat.name) return chat.name;
    else {
      let title = chat.members.reduce((acc, user, idx) => {
        if (idx < 2) return acc + user.username + ', ';
        else if (idx === 2) return acc + 'and ' + user.username + ' ';
        else return acc;
      }, '')
      return title;
    }
  }

  onRemoveChat(chat: Chat) {
    this.isSelectChat[chat.id] = false;
    this.removeChat.emit(chat);
  }

  onSelectChat(chat: Chat) {

    if (this.type === 'share-modal') {
      this.isSelectChat[chat.id] = !this.isSelectChat[chat.id];
      if (this.isSelectChat[chat.id]) {
        this.addChat.emit(chat);
      }
      else {
        this.removeChat.emit(chat);
      }
    }

    else {
      this.currActiveChatId = chat.id;
      this.chatSelected.emit(chat);
    }
  }


}