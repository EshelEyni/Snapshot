import { switchMap } from 'rxjs/operators';
import { Post } from './../../models/post.model';
import { Store } from '@ngrx/store';
import { PostService } from 'src/app/services/post.service';
import { UserService } from './../../services/user.service';
import { State } from './../../store/store';
import { User } from './../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable, map } from 'rxjs';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  }

  queryParamsSubscription!: Subscription;
  userSub!: Subscription;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  isCurrUserLoggedInUser!: boolean;
  user!: User;
  posts$!: Observable<Post[]>;
  isOptionsModalShown = false;
  filterBy = { createdPosts: true, savedPosts: false, taggedPosts: false }
  highlightsIconSize = window.innerWidth < 735 ? 30 : 45;
  postFilterIconSize = window.innerWidth < 735 ? 24 : 12;
  isHighlightsModalShown: boolean = true;
  isMainScreenShown: boolean = true;

  ngOnInit(): void {

    this.userSub = this.route.data.pipe(
      switchMap(data => {
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
        return this.loggedinUser$
      }
      )).subscribe(user => {
        if (user) {
          this.loggedinUser = user
          this.isCurrUserLoggedInUser = this.user.id === this.loggedinUser.id
        }
      })

    this.queryParamsSubscription = this.route.queryParams.subscribe(data => {
      const filterByQueryParams: 'createdPosts' | 'savedPosts' | 'taggedPosts' = data['filterBy'];
      if (filterByQueryParams) this.onSetFilter(filterByQueryParams)
      else this.onSetFilter('createdPosts')
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if ((window.innerWidth < 735 && this.highlightsIconSize !== 30)
      || (window.innerWidth >= 735 && this.highlightsIconSize !== 45)) {
      this.highlightsIconSize = window.innerWidth < 735 ? 30 : 45;
      this.postFilterIconSize = window.innerWidth < 735 ? 24 : 12;
    }
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

  onToggleModal(el: string) {
    console.log('onCloseModal');

    switch (el) {
      case 'highlights':
        this.isHighlightsModalShown = !this.isHighlightsModalShown;
        break;
      case 'options':
        this.isOptionsModalShown = !this.isOptionsModalShown;
        break;
      case 'main-screen':
        if (this.isOptionsModalShown) this.isOptionsModalShown = false;
        if (this.isHighlightsModalShown) this.isHighlightsModalShown = false;
        break;

    }
    this.isMainScreenShown = !this.isMainScreenShown;

  }

  ngOnDestroy() {
    this.userSub?.unsubscribe()
    this.queryParamsSubscription.unsubscribe()
  }
}
