import { PostService } from 'src/app/services/post.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject, lastValueFrom, firstValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { Notification } from '../models/notification.model';

const BASE_URL = process.env['NODE_ENV'] === 'production'
  ? '/api'
  : '//localhost:3030/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _notifications$ = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this._notifications$.asObservable();


  constructor() { }
  userService = inject(UserService);
  http = inject(HttpClient);

  public async loadNotifications(userId: number) {
    let options = { params: { userId } }

    const notifications = await lastValueFrom(
      this.http.get<Notification[]>(`${BASE_URL}/notification`, options),
    )
    this._notifications$.next(notifications)
  }
}