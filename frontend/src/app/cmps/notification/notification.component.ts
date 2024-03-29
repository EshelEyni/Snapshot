import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, inject } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  inputs: ['notification'],
  outputs: ['close'],
})
export class NotificationComponent implements OnInit {
  constructor() {}

  router = inject(Router);

  sub: Subscription | null = null;
  loggedinUser!: User;
  notification!: Notification;

  txt: string = '';
  isFollowedBtnShown: boolean = false;
  isPostImgShown: boolean = false;

  close = new EventEmitter();

  ngOnInit(): void {
    switch (this.notification.type) {
      case 'like-post':
        this.txt = 'liked your post.';
        this.isPostImgShown = true;
        break;
      case 'like-comment':
        this.txt = 'liked your comment.';
        this.isPostImgShown = true;
        break;
      case 'comment':
        this.txt = 'commented on your post.';
        this.isPostImgShown = true;
        break;
      case 'follow':
        this.txt = 'started following you.';
        this.isFollowedBtnShown = true;
        break;
      case 'mention':
        this.txt = 'mentioned you in a post.';
        this.isPostImgShown = true;
        break;
      case 'message':
        this.txt = this.notification.msgCount
          ? `sent you ${this.notification.msgCount} messages.`
          : 'sent you a message.';
        break;
    }
  }

  onClickNotification(): void {
    if (this.notification.postId)
      this.router.navigate(['/post', this.notification.postId]);
    else if (this.notification.type === 'message')
      this.router.navigate(['/inbox/'], {
        queryParams: { chatId: this.notification.entityId },
      });
    else this.router.navigate(['/profile', this.notification.userId]);
    this.close.emit();
  }

  onClickFollowBtn(e: Event): void {
    e.stopPropagation();
  }
}
