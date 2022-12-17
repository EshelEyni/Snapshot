import { MiniUser, User } from './../../models/user.model';
import { TagService } from './../../services/tag.service';
import { State } from './../../store/store';
import { UserService } from './../../services/user.service';
import { LoadLoggedInUser, LoadUsers } from './../../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { CommentService } from 'src/app/services/comment.service';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post-app',
  templateUrl: './post-app.component.html',
  styleUrls: ['./post-app.component.scss']
})
export class PostAppComponent implements OnInit, OnDestroy {
  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));

  }

  postService = inject(PostService)
  userService = inject(UserService);
  tagService = inject(TagService);
  store = inject(Store<State>);

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  posts$!: Observable<Post[]>;
  users: MiniUser[] = [];

  ngOnInit(): void {
    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
    }
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) this.loggedinUser = JSON.parse(JSON.stringify(user));
    })
    this.store.dispatch(new LoadUsers());
    this.postService.loadPosts();
    this.posts$ = this.postService.posts$;
    this.tagService.loadTags();

    for (let i = 0; i < 5; i++) {
      this.users.push(this.userService.getSnapshotUser())

    }
  }


  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

}
