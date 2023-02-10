import { Observable } from 'rxjs';
import { NotificationService } from './../../services/notification.service';
import { Component, OnInit, inject, EventEmitter, HostListener } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  inputs: ['loggedinUser'],
  outputs: ['onClose']
})
export class NotificationModalComponent implements OnInit {

  constructor() { };

  notificationService = inject(NotificationService);
  notifications$!: Observable<Notification[]>;

  loggedinUser!: User;

  onClose = new EventEmitter();

  ngOnInit(): void {
    this.notificationService.loadNotifications();
    this.notifications$ = this.notificationService.notifications$;
  };

  onCloseModal(): void {
    this.onClose.emit();
  };
};