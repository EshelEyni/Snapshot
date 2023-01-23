import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { MiniUser } from './../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Chat } from '../models/chat.model';

const BASE_URL = process.env['NODE_ENV'] === 'production'
  ? '/api/'
  : '//localhost:3030/api'

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private _chats$ = new BehaviorSubject<Chat[]>([])
  public chats$ = this._chats$.asObservable()

  constructor() { }
  http = inject(HttpClient);

  public async loadChats(userId: number) {
    const chats = await firstValueFrom(
      this.http.get(`${BASE_URL}/chat/user-chats/${userId}`)
    ) as Chat[];

    this._chats$.next(chats);
  }


  public async addChat(members: MiniUser[]) {
    const chat = await firstValueFrom(
      this.http.post(`${BASE_URL}/chat`, members)
    );
    return chat;


  }
}
