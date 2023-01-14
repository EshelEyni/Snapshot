import { LoadLoggedInUser } from './../../store/actions/user.actions';
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
  }
  postService = inject(PostService)
  userService = inject(UserService)
  store = inject(Store<State>);

  posts$!: Observable<Post[]>;
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  ngOnInit(): void {

    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
      this.postService.loadPosts(
        {
          userId: loggedinUser.id,
          type: 'explorePagePosts',
          limit: 1000,
          currPostId: null
        }
      );
      this.posts$ = this.postService.posts$;
    }
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) this.loggedinUser = JSON.parse(JSON.stringify(user));
    })


  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

}
