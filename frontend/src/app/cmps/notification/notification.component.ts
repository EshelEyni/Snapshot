import { SaveUser, LoadedLoggedInUser, LoadLoggedInUser } from './../../store/actions/user.actions';
import { MiniUser } from './../../models/user.model';
import { User } from 'src/app/models/user.model';
import { Observable, map, Subscription } from 'rxjs';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  inputs: ['notification'],
  outputs: ['onClose']

})
export class NotificationComponent implements OnInit,OnDestroy {

  constructor(
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  }

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;


  notification!: Notification;
  txt: string = '';
  isFollowed: boolean = false;
  onClose = new EventEmitter();


  ngOnInit(): void {

    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
        this.isFollowed = this.loggedinUser.following.some(following => following.id === this.notification.by.id)
      }
    })

    if (this.notification.type === 'like') this.txt = 'liked your post.';
    else if (this.notification.type === 'comment') this.txt = 'commented on your post.';
    else if (this.notification.type === 'follow') this.txt = 'started following you.';
  }


  onToggleFollow(ev: MouseEvent, userToFollow: MiniUser) {
    console.log('onToggleFollow');
    ev.stopPropagation()
    const user = { ...this.loggedinUser }
    if (this.isFollowed) user.following = user.following.filter(following => following.id !== userToFollow.id)
    else user.following.push(userToFollow)
    this.isFollowed = !this.isFollowed
    this.store.dispatch(new SaveUser(user))
  }

  onCloseModal() {
    this.onClose.emit()
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe()
  }

}
