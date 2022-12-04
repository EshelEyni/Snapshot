import { Component, OnInit, EventEmitter } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  inputs: ['notifications'],
  outputs: ['onClose']
})
export class NotificationListComponent implements OnInit {

  constructor() { }

  notifications!: Notification[];
  onClose = new EventEmitter();

  ngOnInit(): void {
  }

  onCloseModal() {
    this.onClose.emit()
  }

}
