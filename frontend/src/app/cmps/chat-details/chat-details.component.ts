import { Subscription } from 'rxjs';
import { MessageService } from './../../services/message.service';
import { Chat, Message } from '../../models/chat.model';
import { User } from '../../models/user.model';
import { Component, OnInit, EventEmitter, inject, OnChanges, OnDestroy, ViewChild, ElementRef, AfterViewChecked, SimpleChanges } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss'],
  inputs: ['loggedinUser', 'chat'],
  outputs: ['clearChat']
})
export class ChatDetailsComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {

  constructor() { }
  socketService = inject(SocketService);
  messageService = inject(MessageService)
  messages$ = this.messageService.messages$;
  messages: Message[] = [];
  clearChat = new EventEmitter();
  loggedinUser!: User;
  chat!: Chat;
  imgUrlList!: string[];
  memberNameList!: string[];
  isSettingShown = false;
  msgSub!: Subscription;

  ngOnInit(): void {
    const { members } = this.chat;
    this.imgUrlList = members.map(m => m.imgUrl).slice(0, this.chat.isGroup ? 2 : 1);
    this.memberNameList = members.filter(u => u.id !== this.loggedinUser.id).map(m => m.fullname);

    this.socketService.emit('set-chat', this.chat.id);
    this.socketService.on('msg-added', (msg: Message) => {
      console.log('msg-added', `for user ${this.loggedinUser.fullname}`);
      this.messageService.addMsgFromSocket(msg);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat']) {
      const currChatId = changes['chat'].currentValue.id;
      const prevChatId = changes['chat'].previousValue?.id;
      if (currChatId !== prevChatId) {
        this.socketService.emit('unset-chat', prevChatId);
        this.socketService.emit('set-chat', currChatId);
      }
    }

    let isMsgLoaded = false;
    this.msgSub = this.messages$.subscribe(messages => {
      const isChatMsg = messages.every(msg => msg.chatId === this.chat.id) && messages.length;

      if (!isMsgLoaded && !isChatMsg) {
        this.messageService.loadMessages(this.chat.id);
        isMsgLoaded = true;
      }

      this.messages = messages;
    })
  }

  ngAfterViewChecked() {
  }

  onToggleSetting() {
    this.isSettingShown = !this.isSettingShown;
  }

  onDeleteChat() {
    this.clearChat.emit();
  }

  ngOnDestroy() {
    this.msgSub.unsubscribe();
    this.socketService.emit('unset-chat', this.chat.id);
  }
}
