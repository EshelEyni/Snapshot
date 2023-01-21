import { map, Observable, Subscription, lastValueFrom } from 'rxjs';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/services/user.service';
import { MiniUser, User } from './../../models/user.model';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { SaveUser } from 'src/app/store/actions/user.actions';

@Component({
  selector: 'follow-btn',
  templateUrl: './follow-btn.component.html',
  styleUrls: ['./follow-btn.component.scss'],
  inputs: ['user', 'type'],
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
    this.sub = this.loggedinUser$.subscribe(async user => {
      if (user) {
        this.loggedinUser = { ...user }
        this.isFollowed = await this.userService.checkIsFollowing(this.loggedinUser.id, this.user.id);
      }
    })
  }

  async onToggleFollow(user: MiniUser) {
    this.userService.toggleFollow(this.isFollowed, this.loggedinUser.id, user);
    this.isFollowed = !this.isFollowed;
    this.loggedinUser.followingSum = this.isFollowed ? this.loggedinUser.followingSum + 1 : this.loggedinUser.followingSum - 1;
    this.store.dispatch(new SaveUser(this.loggedinUser));
    const fullUser = await lastValueFrom(this.userService.getById(user.id));
    if (!fullUser) return;
    fullUser.followersSum = this.isFollowed ? fullUser.followersSum + 1 : fullUser.followersSum - 1;
    this.store.dispatch(new SaveUser(fullUser));
  }


  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
