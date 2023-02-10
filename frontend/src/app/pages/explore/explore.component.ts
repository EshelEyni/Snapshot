import { User } from './../../models/user.model';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { UserService } from './../../services/user.service';
import { Post } from './../../models/post.model';
import { Observable, map, Subscription } from 'rxjs';
import { PostService } from './../../services/post.service';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  };

  postService = inject(PostService);
  userService = inject(UserService);
  store = inject(Store<State>);

  postSub: Subscription | null = null;
  posts$!: Observable<Post[]>;
  posts: Post[] = [];

  sub: Subscription | null = null;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;

  async ngOnInit(): Promise<void> {
    this.sub = this.loggedinUser$.subscribe(async user => {
      if (user) {
        this.loggedinUser = { ...user };

        await this.postService.loadPosts(
          {
            userId: user.id,
            type: 'explorePagePosts',
            limit: 1000,
          }
        );
      };
    });

    this.postSub = this.postService.posts$.subscribe(posts => {
      this.posts = posts;
    });
  };

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.postSub) this.postSub.unsubscribe();
    this.postService.clearPosts();
  };
};