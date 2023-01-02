import { map, Observable, Subscription } from 'rxjs';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/services/user.service';
import { MiniUser, User } from './../../models/user.model';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'follow-btn',
  templateUrl: './follow-btn.component.html',
  styleUrls: ['./follow-btn.component.scss'],
  inputs: ['user','type'],
})
export class FollowBtnComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  }

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  userService = inject(UserService);
  store = inject(Store<State>);

  isFollowed: boolean = false;
  user!: MiniUser;
  type!: string;

  async ngOnInit() {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
      }
    })
    this.isFollowed = await this.userService.checkIsFollowing(this.loggedinUser.id, this.user.id);
  }

  onToggleFollow(user: MiniUser) {
    this.userService.toggleFollow(this.isFollowed, this.loggedinUser.id, user);
    this.isFollowed = !this.isFollowed;
  }


  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
