import { TagService } from './../../services/tag.service';
import { Tag } from './../../models/tag.model';
import { map, Observable, Subscription, lastValueFrom } from 'rxjs';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/services/user.service';
import { MiniUser, User } from './../../models/user.model';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import {
  LoadedLoggedInUser,
  LoadedUser,
} from 'src/app/store/actions/user.actions';
import { FollowService } from 'src/app/services/follow.service';

@Component({
  selector: 'follow-btn',
  templateUrl: './follow-btn.component.html',
  styleUrls: ['./follow-btn.component.scss'],
  inputs: ['user', 'tag'],
})
export class FollowBtnComponent implements OnInit, OnDestroy {
  constructor() {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser));
  }

  userService = inject(UserService);
  followService = inject(FollowService);
  tagService = inject(TagService);
  store = inject(Store<State>);

  sub: Subscription | null = null;

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  user!: MiniUser;
  tag!: Tag;

  isFollowed: boolean = false;

  async ngOnInit(): Promise<void> {
    this.sub = this.loggedinUser$.subscribe(async (user) => {
      if (user) {
        this.loggedinUser = { ...user };
      }
    });

    if (this.user) {
      this.isFollowed = !!this.user.isFollowing;
    }
    if (this.tag) {
      this.isFollowed = !!this.tag.isFollowing;
    }
  }

  async onToggleFollow(): Promise<void> {
    if (this.user && !this.tag) {
      await this.followService.toggleFollow(this.isFollowed, this.user);
      this.loggedinUser.followingSum = !this.isFollowed
        ? this.loggedinUser.followingSum + 1
        : this.loggedinUser.followingSum - 1;

      this.store.dispatch(new LoadedLoggedInUser(this.loggedinUser));
    }

    if (this.tag && !this.user) {
      await this.tagService.toggleFollow(this.isFollowed, this.tag.id);
    }
    this.isFollowed = !this.isFollowed;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
