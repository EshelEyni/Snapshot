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
    this.users$ = this.store.select('userState').pipe(map((x => x.users)));
  }

  postService = inject(PostService)
  userService = inject(UserService);
  store = inject(Store<State>);

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  users$: Observable<MiniUser[]>;
  subLoggedinUSer: Subscription | null = null;
  subUsers: Subscription | null = null;

  posts$!: Observable<Post[]>;
  users: MiniUser[] = [];

  async ngOnInit() {
    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
    }
    this.store.dispatch(new LoadUsers('suggested'));

    this.subLoggedinUSer = this.loggedinUser$.subscribe(user => {
      if (user) this.loggedinUser = JSON.parse(JSON.stringify(user));
    });

    this.subUsers = this.users$.subscribe(users => {
      if (users) this.users = JSON.parse(JSON.stringify(users));
    });

    this.postService.loadPosts();
    this.posts$ = this.postService.posts$;
  }

  ngOnDestroy(): void {
    if (this.subLoggedinUSer) this.subLoggedinUSer.unsubscribe();
    if (this.subUsers) this.subUsers.unsubscribe();
  }

}