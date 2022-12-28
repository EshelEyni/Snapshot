import { LoadLoggedInUser } from './../../store/actions/user.actions';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user.model';
import { Post } from './../../models/post.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, lastValueFrom, Observable, map } from 'rxjs';
import { PostService } from './../../services/post.service';
import { Tag } from '../../models/tag.model';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.scss']
})
export class TagDetailsComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));

  }
  postService = inject(PostService);
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  store = inject(Store<State>);

  tag!: Tag;
  posts: Post[] = [];
  paramsSubscription!: Subscription;
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  ngOnInit(): void {

    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
    }
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) this.loggedinUser = JSON.parse(JSON.stringify(user));
    })

    this.paramsSubscription = this.route.data.subscribe(data => {
      const tag = data['tag']
      if (tag) {
        this.tag = tag
        tag.postIds.forEach(async (postId: string) => {
          const post = await lastValueFrom(this.postService.getById(postId))
          this.posts.push({ ...post })
        })
      }
    })
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
    if (this.sub) this.sub.unsubscribe();
  }

}
