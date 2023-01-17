import { Post } from './../../models/post.model';
import { Store } from '@ngrx/store';
import { PostService } from 'src/app/services/post.service';
import { UserService } from './../../services/user.service';
import { State } from './../../store/store';
import { User } from './../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable, map } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private store: Store<State>
  ) {
    this.user$ = this.store.select('userState').pipe(map((x => x.user)));
  }

  paramsSubscription!: Subscription;
  queryParamsSubscription!: Subscription;
  sub: Subscription | null = null;
  user$: Observable<User | null>;
  user!: User;
  posts$!: Observable<Post[]>;
  isOptionsModalShown = true;
  filterBy = { createdPosts: true, savedPosts: false, taggedPosts: false }
  // user

  ngOnInit(): void {
    this.paramsSubscription = this.route.data.subscribe(data => {
      const user = data['user']
      if (user) {
        console.log('user.postSum', user.postSum)
        this.user = user
        this.postService.loadPosts(
          {
            userId: this.user.id,
            type: 'createdPosts',
            limit: 100,
          }
        )
        this.posts$ = this.postService.posts$;
      }
    })


    this.queryParamsSubscription = this.route.queryParams.subscribe(data => {
      const filterByQueryParams: 'createdPosts' | 'savedPosts' | 'taggedPosts' = data['filterBy'];
      if (filterByQueryParams) this.onSetFilter(filterByQueryParams)
      else this.onSetFilter('createdPosts')
    });

  }

  onSetFilter(filterBy: string) {
    console.log('onSetFilter')
    switch (filterBy) {
      case 'createdPosts':
        this.filterBy = { createdPosts: true, savedPosts: false, taggedPosts: false }
        this.postService.loadPosts(
          {
            userId: this.user.id,
            type: 'createdPosts',
            limit: 100,
          }
        )
        this.posts$ = this.postService.posts$;
        break;
      case 'savedPosts':
        this.filterBy = { createdPosts: false, savedPosts: true, taggedPosts: false }
        this.postService.loadPosts(
          {
            userId: this.user.id,
            type: 'savedPosts',
            limit: 100,
          }
        );
        this.posts$ = this.postService.posts$;
        break;
      case 'taggedPosts':
        this.filterBy = { createdPosts: false, savedPosts: false, taggedPosts: true }
        this.postService.loadPosts(
          {
            userId: this.user.id,
            type: 'taggedPosts',
            limit: 100,
            username: this.user.username
          }
        );
        this.posts$ = this.postService.posts$;
        break;
    }

  }

  onToggleModal() {
    this.isOptionsModalShown = !this.isOptionsModalShown;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
    this.paramsSubscription.unsubscribe()
    this.queryParamsSubscription.unsubscribe()
  }
}
