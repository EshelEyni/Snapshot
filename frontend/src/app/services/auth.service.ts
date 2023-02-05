import { UserService } from 'src/app/services/user.service';
import { HttpService } from './http.service';
import { User } from './../models/user.model';
import { CommunicationService } from './communication.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable, lastValueFrom, firstValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  http = inject(HttpClient);
  httpService = inject(HttpService);
  userService = inject(UserService);
  storageService = inject(StorageService);
  communicationService = inject(CommunicationService);
  router = inject(Router);

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl();

  public async login(userCred: { username: string; password: string }): Promise<User | null | void> {
    try {
      const options = {
        observe: 'response' as const,
        responseType: 'json' as const,
        withCredentials: true,
      };

      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/auth/login`, userCred, options) as unknown as Observable<{ body: User }>
      );

      if (!res) return;
      const user = res.body;

      this.storageService.saveToStorage('loggedinUser', {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        imgUrl: user.imgUrl,
      });

      return user;
    } catch (error) {
      console.log('error', error);
      this.communicationService.setUserMsg('Invalid username or password');
      return null;
    };
  };

  public async signup(userCred: {
    email: string
    fullname: string
    username: string
    password: string
  }): Promise<User | null | void> {

    userCred.username = userCred.username.trim();

    try {
      const options = {
        observe: 'response' as const,
        responseType: 'json' as const,
        withCredentials: true,
      };

      const res = await lastValueFrom(
        this.http.post<User>(`${this.baseUrl}/auth/signup`,userCred, options) as unknown as Observable<{ body: User }>
      );

      if (!res) return;
      const user = res.body;

      this.storageService.saveToStorage('loggedinUser', {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        imgUrl: this.userService.getDefaultUserImgUrl(),
      });

      return user;
    } catch (error) {
      this.communicationService.setUserMsg(`Username ${userCred.username} already exists!`);
      return null;
    };
  };

  public async logout(): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.baseUrl}/auth/logout`, {}),
    );
    this.storageService.saveToStorage('loggedinUser', null);
    this.router.navigate(['/login']);
  };
}
