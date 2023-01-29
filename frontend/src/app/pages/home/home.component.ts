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
  subLoggedinUser: Subscription | null = null;
  subUsers: Subscription | null = null;

  posts$!: Observable<Post[]>;
  users: MiniUser[] = [];

  async ngOnInit() {
    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));

      this.store.dispatch(new LoadUsers({
        userId: loggedinUser.id,
        type:'suggested',
        limit: 5,
      })); 
    }
    
    this.subLoggedinUser = this.loggedinUser$.subscribe(user => {
      if (user){
        this.loggedinUser = {...user};
        this.postService.loadPosts(
          {
            userId: this.loggedinUser.id,
            type: 'homepagePosts',
            limit: 1000,
          }
        );
  
        this.posts$ = this.postService.posts$;
      }
    });

    this.subUsers = this.users$.subscribe(users => {
      if (users) this.users = [...users];
    });

  }

  ngOnDestroy(): void {
    if (this.subLoggedinUser) this.subLoggedinUser.unsubscribe();
    if (this.subUsers) this.subUsers.unsubscribe();
  }

}