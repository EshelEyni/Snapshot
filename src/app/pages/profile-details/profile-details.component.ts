import { Post } from './../../models/post.model';
import { Store } from '@ngrx/store';
import { PostService } from 'src/app/services/post.service';
import { UserService } from './../../services/user.service';
import { State } from './../../store/store';
import { User } from './../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private store: Store<State>
  ) {
    this.user$ = this.store.select('userState').pipe(map((x => x.user)));
  }

  paramsSubscription!: Subscription;
  sub: Subscription | null = null;
  user$: Observable<User | null>;
  user!: User;
  posts$!: Observable<Post[]>;
  // user

  ngOnInit(): void {
    this.paramsSubscription = this.route.data.subscribe(data => {
      const user = data['user']
      if (user) {
        this.user = user
        this.postService.loadPosts({ userId: this.user.id });
        this.posts$ = this.postService.posts$;
      }
    })

  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
    this.paramsSubscription.unsubscribe()
  }
}
