import { MiniUser, User } from './../../models/user.model';
import { State } from './../../store/store';
import { UserService } from './../../services/user.service';
import { LoadLoggedInUser, LoadUsers } from './../../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  }

  postService = inject(PostService)
  userService = inject(UserService);
  store = inject(Store<State>);

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  posts$!: Observable<Post[]>;
  users: MiniUser[] = [];

  async ngOnInit() {
    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
    }
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) this.loggedinUser = JSON.parse(JSON.stringify(user));
    })
    this.store.dispatch(new LoadUsers('suggest'));
    this.postService.loadPosts();
    this.posts$ = this.postService.posts$;
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

}