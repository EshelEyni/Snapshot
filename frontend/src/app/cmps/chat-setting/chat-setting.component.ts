import { MiniUser } from 'src/app/models/user.model';
import { ChatService } from './../../services/chat.service';
import { User } from './../../models/user.model';
import { Chat } from './../../models/chat.model';
import { Component, OnInit, OnChanges, inject, EventEmitter } from '@angular/core';

@Component({
  selector: 'chat-setting',
  templateUrl: './chat-setting.component.html',
  styleUrls: ['./chat-setting.component.scss'],
  inputs: ['chat', 'loggedinUser'],
  outputs: ['clearChat']
})
export class ChatSettingComponent implements OnInit, OnChanges {

  constructor() { }
  clearChat = new EventEmitter();
  chatService = inject(ChatService);
  chat!: Chat;
  loggedinUser!: User;
  chatName!: string;
  isMuteMsg = false;
  isLoggedinUserAdmin = false;

  ngOnInit(): void {
    // this.chatName = this.chat.name ? this.chat.name : '';
    // this.isMuteMsg = this.chat.isMuted;
  }

  ngOnChanges() {
    this.chatName = this.chat.name ? this.chat.name : '';
    this.isMuteMsg = this.chat.isMuted;
    this.isLoggedinUserAdmin = this.chat.admins.some(a => a.id === this.loggedinUser.id);
  }

  async onChangeChatName() {
    const chat = { ...this.chat, name: this.chatName }
    await this.chatService.updateChat(chat, this.loggedinUser.id);
    this.chat = chat;
  }

  async onLeaveChat() {
    this.chat.members = this.chat.members.filter(m => m.id !== this.loggedinUser.id);
    this.chat.admins = this.chat.admins.filter(a => a.id !== this.loggedinUser.id);
    await this.chatService.updateChat(this.chat, this.loggedinUser.id);
    this.clearChat.emit();
  }

  async onToggleMute() {
    const chat = { ...this.chat, isMuted: !this.chat.isMuted }
    await this.chatService.updateChat(chat, this.loggedinUser.id);
    this.chat = chat;
  }

  async onDeleteChat() {
    await this.chatService.deleteChat(this.chat.id, this.loggedinUser.id);
    this.clearChat.emit();
  }
}
