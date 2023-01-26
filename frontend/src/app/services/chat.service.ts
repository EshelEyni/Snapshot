import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { MiniUser } from './../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Chat } from '../models/chat.model';

const BASE_URL = process.env['NODE_ENV'] === 'production'
  ? '/api/'
  : '//localhost:3030/api';

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


  public async addChat(chat: Chat): Promise<number | void> {
    const { members } = chat;
    const res = await firstValueFrom(
      this.http.post(`${BASE_URL}/chat`, members)
    ) as { msg: string, id: number };

    if (res.msg === 'Chat added') {
      const chats = this._chats$.getValue();
      chats.unshift({ ...chat, id: res.id });
      this._chats$.next(chats);
      return res.id;
    }
  }

  public async updateChat(chat: Chat, userId: number) {
    const res = await firstValueFrom(
      this.http.put(`${BASE_URL}/chat/${chat.id}`, { chat, userId })
    ) as { msg: string };

    if (res.msg === 'Chat updated') {
      const chats = this._chats$.getValue();
      const idx = chats.findIndex(c => c.id === chat.id);
      chats[idx] = chat;
      this._chats$.next(chats);
    }
  }

  public async deleteChat(chatId: number, userId: number) {
    await firstValueFrom(
      this.http.delete(`${BASE_URL}/chat/${chatId}`)
    );

    await this.loadChats(userId);
  }

  public getEmptyChat(loggedinUser: MiniUser, members: MiniUser[]): Chat {
    return {
      id: 0,
      name: null,
      admins: [loggedinUser],
      members: [{ isAdmin: true, ...loggedinUser } as MiniUser, ...members],
      messages: [],
      isGroup: members.length > 2,
      isBlocked: false,
      isMuted: false,
    }
  }
}
