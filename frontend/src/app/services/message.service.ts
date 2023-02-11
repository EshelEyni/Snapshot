import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Message } from '../models/chat.model';
import { ChatService } from './chat.service';
import { HttpService } from './http.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {}

  private _messages$ = new BehaviorSubject<Message[]>([]);
  public messages$ = this._messages$.asObservable();

  http = inject(HttpClient);
  socketService = inject(SocketService);
  httpService = inject(HttpService);
  chatService = inject(ChatService);

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl();

  public async loadMessages(chatId: number): Promise<void> {
    const options = { withCredentials: true };
    const messages = (await firstValueFrom(
      this.http.get(`${this.baseUrl}/message/chat/${chatId}`, options)
    )) as Message[];

    this._messages$.next(messages);
  }

  public async addMessage(msg: Message): Promise<void> {
    const options = { withCredentials: true };
    const res = (await firstValueFrom(
      this.http.post(`${this.baseUrl}/message`, msg, options)
    )) as { msg: string; id: number };

    if (res.msg === 'Message added') {
      let messages = this._messages$.getValue();
      msg.id = res.id;
      messages.push(msg);
      this._messages$.next(messages);
      this.socketService.emit('msg-added', msg);
      this.chatService.sortChatsByLastMsg(msg.chatId);
    }
  }

  public addMsgFromSocket(msg: Message): void {
    let messages = this._messages$.getValue();
    messages.push(msg);
    this._messages$.next(messages);
  }

  public getEmptyMessage(): Message {
    const newMsg = {
      id: 0,
      type: '',
      chatId: 0,
      sender: {
        id: 0,
        username: '',
        fullname: '',
        imgUrl: '',
        currStoryId: 0,
        isStoryViewed: false,
        isFollowing: false,
      },
      createdAt: new Date(),
      text: '',
      post: undefined,
      story: undefined,
      imgUrl: '',
    };

    return newMsg;
  }
}
