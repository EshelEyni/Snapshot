import { Component, OnInit, EventEmitter, OnChanges } from '@angular/core';
import { Notification, NotificationsByDate } from 'src/app/models/notification.model';

@Component({
  selector: 'notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  inputs: ['notifications'],
  outputs: ['close']
})

export class NotificationListComponent implements OnInit, OnChanges {

  constructor() { };

  notifications!: Notification[];
  notificationsByDate!: NotificationsByDate;
  keys: (keyof NotificationsByDate)[] = [];

  close = new EventEmitter();

  ngOnInit(): void { };

  ngOnChanges(): void {
    if (this.notifications) {
      this.notifications = this.reduceDuplicatedMessageNotifications(this.notifications);
      this.notificationsByDate = this.reduceByDate(this.notifications);
      this.keys = Object.keys(this.notificationsByDate) as (keyof NotificationsByDate)[];
    };
  };

  reduceDuplicatedMessageNotifications(notifications: Notification[]): Notification[] {
    return notifications.reduce((acc, notification) => {
      if (notification.type === 'message') {
        const lastNotification = acc[acc.length - 1];
        if (lastNotification && lastNotification.type === 'message'
          && lastNotification.by.id === notification.by.id) {
          lastNotification.msgCount = (lastNotification.msgCount || 1) + 1;
          return acc;
        };
      };
      acc.push(notification);
      return acc;
    }, [] as Notification[]);
  };

  reduceByDate(notifications: Notification[]): NotificationsByDate {
    return notifications.reduce((acc, notification) => {
      const date = new Date(notification.createdAt);
      const key = this.getDateKey(date);
      const label = this.getLabel(key);
      if (!acc[key]) {
        acc[key] = { label, notifications: [] as Notification[] };
      };
      acc[key].notifications.push(notification);
      return acc;
    }, {} as NotificationsByDate);
  };

  getDateKey(date: Date): 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'earlier' {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date();
    thisWeek.setDate(today.getDate() - 7);
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 14);
    const thisMonth = new Date();
    thisMonth.setDate(today.getDate() - 30);

    if (date.toDateString() === today.toDateString()) {
      return 'today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'yesterday';
    } else if (date > thisWeek) {
      return 'thisWeek';
    } else if (date > lastWeek) {
      return 'lastWeek';
    } else if (date > thisMonth) {
      return 'thisMonth';
    } else {
      return 'earlier';
    };
  };

  getLabel(key: string): 'Today' | 'Yesterday' | 'This Week' | 'Last Week' | 'This Month' | 'Earlier' {
    switch (key) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'thisWeek':
        return 'This Week';
      case 'lastWeek':
        return 'Last Week';
      case 'thisMonth':
        return 'This Month';
      case 'earlier':
        return 'Earlier';
      default:
        return 'Earlier';
    };
  };

  closeModal() {
    this.close.emit();
  };
};