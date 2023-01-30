import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { Notification } from '../models/notification.model';
import { HttpService } from './http.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _notifications$ = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this._notifications$.asObservable();

  constructor() { };

  httpService = inject(HttpService);

  baseUrl = this.httpService.getBaseUrl();

  userService = inject(UserService);
  http = inject(HttpClient);

  public async loadNotifications(userId: number): Promise<void> {
    let options = { params: { userId } };

    const notifications = await lastValueFrom(
      this.http.get<Notification[]>(`${this.baseUrl}/notification`, options),
    );
    this._notifications$.next(notifications);
  };
};