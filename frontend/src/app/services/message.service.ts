import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Message } from '../models/chat.model';
import { SocketService } from './socket.service';


const BASE_URL = process.env['NODE_ENV'] === 'production'
  ? '/api/'
  : '//localhost:3030/api';


@Injectable({
  providedIn: 'root'
})

export class MessageService {

  constructor() { }

  private _messages$ = new BehaviorSubject<Message[]>([])
  public messages$ = this._messages$.asObservable()

  http = inject(HttpClient);
  socketService = inject(SocketService);

  public async loadMessages(chatId: number) {
    let messages = await firstValueFrom(
      this.http.get(`${BASE_URL}/message/chat/${chatId}`)
    ) as Message[];

    this._messages$.next(messages);
  }

  public async addMessage(msg: Message) {
    const res = await firstValueFrom(
      this.http.post(`${BASE_URL}/message`, msg)
    ) as { msg: string, id: number };

    if (res.msg === 'Message added') {
      let messages = this._messages$.getValue();
      msg.id = res.id;
      messages.push(msg);
      this._messages$.next(messages);
      this.socketService.emit('msg-added', msg);
    }
  }


  public getEmptyMessage() {
    const newMsg = {
      id: 0,
      type: '',
      chatId: 0,
      sender: {
        id: 0,
        username: '',
        fullname: '',
        imgUrl: ''
      },
      createdAt: new Date(),
      text: '',
      postId: 0,
      imgUrl: ''
    }

    return newMsg;
  }

}
