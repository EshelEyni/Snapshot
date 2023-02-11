import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { MiniUser } from './../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Chat } from '../models/chat.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _chats$ = new BehaviorSubject<Chat[]>([]);
  public chats$ = this._chats$.asObservable();

  constructor() {}
  http = inject(HttpClient);
  httpService = inject(HttpService);

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl();

  public async loadChats(): Promise<void> {
    const options = { withCredentials: true };
    const chats = (await firstValueFrom(
      this.http.get(`${this.baseUrl}/chat/user-chats`, options)
    )) as Chat[];

    this._chats$.next(chats);
  }

  public sortChatsByLastMsg(chatsId: number): void {
    const chats = this._chats$.getValue();
    const idx = chats.findIndex((c) => c.id === chatsId);
    const chat = chats[idx];
    chats.splice(idx, 1);
    chats.unshift(chat);
    this._chats$.next(chats);
  }

  public async getPersonalChatId(userId: number): Promise<number> {
    const options = { withCredentials: true };
    const res = (await firstValueFrom(
      this.http.get(`${this.baseUrl}/chat/personal-chat/${userId}`, options)
    )) as { chatId: number };

    return res.chatId;
  }

  public async addChat(chat: Chat): Promise<number | void> {
    const options = { withCredentials: true };
    const { members } = chat;
    const res = (await firstValueFrom(
      this.http.post(`${this.baseUrl}/chat`, members, options)
    )) as { msg: string; id: number };

    if (res.msg === 'Chat added') {
      let chats = this._chats$.getValue();
      chats = chats.filter((c) => c.id !== res.id);
      chats.unshift({ ...chat, id: res.id });
      this._chats$.next(chats);
      return res.id;
    }
  }

  public async updateChat(chat: Chat, userId: number): Promise<void> {
    const options = { withCredentials: true };

    const res = (await firstValueFrom(
      this.http.put(
        `${this.baseUrl}/chat/${chat.id}`,
        { chat, userId },
        options
      )
    )) as { msg: string };

    if (res.msg === 'Chat updated') {
      const chats = this._chats$.getValue();
      const idx = chats.findIndex((c) => c.id === chat.id);
      chats[idx] = chat;
      this._chats$.next(chats);
    }
  }

  public async deleteChat(chatId: number, userId: number): Promise<void> {
    const options = { withCredentials: true };

    await firstValueFrom(
      this.http.delete(`${this.baseUrl}/chat/${chatId}`, options)
    );

    await this.loadChats();
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
    };
  }
}
