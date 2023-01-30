import { ChatService } from './../../services/chat.service';
import { Chat } from './../../models/chat.model';
import { MiniUser, User } from 'src/app/models/user.model';
import { Component, OnInit, EventEmitter, inject } from '@angular/core';

@Component({
  selector: 'chat-options-modal',
  templateUrl: './chat-options-modal.component.html',
  styleUrls: ['./chat-options-modal.component.scss'],
  inputs: ['chat', 'loggedinUser', 'currUser'],
  outputs: ['close'],
})
export class ChatOptionsModalComponent implements OnInit {

  constructor() { }

  chatService = inject(ChatService);

  chat!: Chat;
  loggedinUser!: User;
  currUser!: MiniUser;

  isCurrUserAdmin: boolean = false;

  close = new EventEmitter();

  ngOnInit(): void {
    this.isCurrUserAdmin = this.chat.admins.some(a => a.id === this.currUser.id);
  };

  async onRemoveUser(): Promise<void> {
    this.chat.members = this.chat.members.filter(m => m.id !== this.currUser.id);
    this.chat.admins = this.chat.admins.filter(a => a.id !== this.currUser.id);
    await this.chatService.updateChat(this.chat, this.loggedinUser.id);
    this.close.emit();
  };

  async onToggleAdmin(): Promise<void> {
    if (this.isCurrUserAdmin) {
      this.chat.admins = this.chat.admins.filter(a => a.id !== this.currUser.id);
    } else {
      this.chat.admins = [...this.chat.admins, this.currUser];
    };
    const currUserIdx = this.chat.members.findIndex(m => m.id === this.currUser.id);
    this.chat.members[currUserIdx] = { ...this.chat.members[currUserIdx] };
    await this.chatService.updateChat(this.chat, this.loggedinUser.id);
    this.close.emit();
  };

  onCloseModal(): void {
    this.close.emit();
  };
};