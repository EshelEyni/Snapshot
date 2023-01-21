import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  inputs: ['notification'],
  outputs: ['onClose']

})
export class NotificationComponent implements OnInit {

  constructor() { }

  loggedinUser!: User
  sub: Subscription | null = null;


  notification!: Notification;
  txt: string = '';
  isFollowed: boolean = false;
  post!: Post;
  onClose = new EventEmitter();


  ngOnInit(): void {
    if (this.notification.post) this.post = this.notification.post;

    if (this.notification.type === 'like-post') this.txt = 'liked your post.';
    if (this.notification.type === 'like-comment') this.txt = 'liked your comment.';
    else if (this.notification.type === 'comment') this.txt = 'commented on your post.';
    else if (this.notification.type === 'follow') this.txt = 'started following you.';
    else if (this.notification.type === 'mention') this.txt = 'mentioned you in a post.';
  }

  onCloseModal() {
    this.onClose.emit()
  }

}
