import { UserService } from 'src/app/services/user.service';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { Notification } from '../models/notification.model';
import { asyncStorageService } from './async-storage.service';

const NOTIFICATIONS:Notification[] = [
  // {
  //   id: '12',
  //   type: 'follow',
  //   by: {
  //     id: 'a12F34b907',
  //     fullname: 'Yossi',
  //     username: 'tale',
  //     imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1668096213/r3tultfspxvxqrtc6bll.jpg',
  //   },
  //   createdAt: new Date(),
  //   userId: 'a12tgeko907'

  // },
  // {
  //   id: '13',
  //   type: 'like',
  //   by: {
  //     id: 'a12F34b907',
  //     fullname: 'Yossi',
  //     username: 'tale',
  //     imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1668096213/r3tultfspxvxqrtc6bll.jpg',
  //   },
  //   createdAt: new Date(),
  //   postImg: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1668096213/r3tultfspxvxqrtc6bll.jpg',
  //   userId: 'a12tgeko907'
  // },
]

const ENTITY = 'notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _notificationsDb: Notification[] = NOTIFICATIONS;
  private _notifications$ = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this._notifications$.asObservable();


  constructor() { }
  storageService = inject(StorageService);
  userService = inject(UserService);

  public loadNotifications(): void {
    let notifications = this.storageService.loadFromStorage(ENTITY) || null
    if (!notifications) {
      const loggedinUser = this.userService.getLoggedinUser()
      if (!loggedinUser) return
      notifications = this._notificationsDb.filter((notification: Notification) => notification.userId === loggedinUser.id);
      this.storageService.saveToStorage(ENTITY, notifications)
    }
    this._notifications$.next(notifications);
  }

  public getById(notificationId: number): Notification {
    let notifications = this.storageService.loadFromStorage(ENTITY)
    const notification = notifications.find((notification: Notification) => notification.id === notificationId)
    return notification
  }

  public remove(notificationId: number) {
    let notifications = this.storageService.loadFromStorage(ENTITY)
    notifications = notifications.filter((notification: Notification) => notification.id !== notificationId)
    this._notifications$.next([...notifications])
    this.storageService.saveToStorage(ENTITY, notifications)
  }

  public save(notification: Notification) {
    return notification.id ? this._update(notification) : this._add(notification)

  }

  private async _add(notification: Notification) {
    // const addedNotification = await asyncStorageService.post(ENTITY, notification) as Notification
    // this.loadNotifications()
    // return addedNotification.id
  }

  private async _update(notification: Notification) {
    // await asyncStorageService.put(ENTITY, notification)
    this.loadNotifications()
  }

}
