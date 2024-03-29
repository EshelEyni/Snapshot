import { faCamera, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { StoryService } from './../../services/story.service';
import { switchMap } from 'rxjs/operators';
import { Post } from './../../models/post.model';
import { Store } from '@ngrx/store';
import { PostService } from 'src/app/services/post.service';
import { State } from './../../store/store';
import { User } from './../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, map, lastValueFrom } from 'rxjs';
import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, Renderer2, HostBinding } from '@angular/core';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private storyService: StoryService,
    private store: Store<State>,
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  };

  faCamera = faCamera;
  faHashtag = faHashtag;


  userSub!: Subscription;
  user!: User;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  queryParamsSubscription!: Subscription;
  
  postSub!: Subscription;
  posts: Post[] = [];
  
  highlightsIconSize = window.innerWidth < 735 ? 30 : 45;
  postFilterIconSize = window.innerWidth < 735 ? 24 : 12;
  
  listPosition: string = '0';
  highlightIdx: number = 0;
  userImgClass: string = '';
  
  isOptionsModalShown = false;
  filterBy = { createdPosts: true, savedPosts: false, taggedPosts: false }
  isPaginationBtnShown = { left: false, right: false };
  isHighlightsModalShown: boolean = false;
  isMainScreenShown: boolean = false;
  isPostEditModalShown: boolean = false;
  isFollowersModalShown: boolean = false;
  isFollowingModalShown: boolean = false;
  isLoggedinUserProfile!: boolean;
  
  ngOnInit(): void {
    this.userSub = this.route.data.pipe(
      switchMap(data => {
        const user = data['user'];
        if (user) {
          this.user = user;
          this.postService.loadPosts(
            {
              userId: this.user.id,
              type: 'createdPosts',
              limit: 100,
            }
          );
          this.postSub = this.postService.posts$.subscribe(posts => {
            this.posts = posts;
          });
        };
        return this.loggedinUser$;
      }
      )).subscribe(async user => {
        if (user) {
          this.loggedinUser = user;
          this.isLoggedinUserProfile = this.user.id === this.loggedinUser.id;
          if (this.user.currStoryId) {
            this.userImgClass = user.isStoryViewed ? 'story-viewed' : 'story-not-viewed';
          }
          else {
            this.userImgClass = '';
          };
        };
      });

    this.queryParamsSubscription = this.route.queryParams.subscribe(data => {
      const filterByQueryParams: 'createdPosts' | 'savedPosts' | 'taggedPosts' = data['filterBy'];
      if (filterByQueryParams) this.onSetFilter(filterByQueryParams);
      else this.onSetFilter('createdPosts');
    });
  };

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if ((window.innerWidth < 735 && this.highlightsIconSize !== 30)
      || (window.innerWidth >= 735 && this.highlightsIconSize !== 45)) {
      this.highlightsIconSize = window.innerWidth < 735 ? 30 : 45;
      this.postFilterIconSize = window.innerWidth < 735 ? 24 : 12;
    };
  };

  onSetFilter(filterBy: string): void {
    switch (filterBy) {
      case 'createdPosts':
        this.filterBy = { createdPosts: true, savedPosts: false, taggedPosts: false };
        this.postService.loadPosts(
          {
            userId: this.user.id,
            type: 'createdPosts',
            limit: 100,
          }
        );
        break;
      case 'savedPosts':
        this.filterBy = { createdPosts: false, savedPosts: true, taggedPosts: false };
        this.postService.loadPosts(
          {
            userId: this.user.id,
            type: 'savedPosts',
            limit: 100,
          }
        );
        break;
      case 'taggedPosts':
        this.filterBy = { createdPosts: false, savedPosts: false, taggedPosts: true };
        this.postService.loadPosts(
          {
            userId: this.user.id,
            type: 'taggedPosts',
            limit: 100,
            username: this.user.username
          }
        );
        break;
    };
  };

  onClickFollowing(): void {
    if (window.innerWidth < 735) {
      this.router.navigate(['/following/', this.user.id]);
    } else {
      this.onToggleModal('following');
    };
  };

  onClickFollowers(): void {
    if (window.innerWidth < 735) {
      this.router.navigate(['/followers/', this.user.id]);
    } else {
      this.onToggleModal('followers');
    };
  };


  onToggleModal(el: string): void {

    switch (el) {
      case 'highlights':
        this.isHighlightsModalShown = !this.isHighlightsModalShown;
        break;
      case 'options':
        this.isOptionsModalShown = !this.isOptionsModalShown;
        break;
      case 'post-edit':
        this.isPostEditModalShown = !this.isPostEditModalShown;
        break;
      case 'followers':
        this.isFollowersModalShown = !this.isFollowersModalShown;
        break;
      case 'following':
        this.isFollowingModalShown = !this.isFollowingModalShown;
        break;
      case 'main-screen':
        if (this.isFollowersModalShown) this.isFollowersModalShown = false;
        if (this.isFollowingModalShown) this.isFollowingModalShown = false;
        if (this.isOptionsModalShown) this.isOptionsModalShown = false;
        if (this.isHighlightsModalShown) this.isHighlightsModalShown = false;
        if (this.isPostEditModalShown) this.isPostEditModalShown = false;
        break;
    };
    this.isMainScreenShown = !this.isMainScreenShown;
  };

  onGoToStory(): void {
    this.router.navigate(['/story/', this.user.currStoryId]);
  };

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
    this.postSub?.unsubscribe();
    this.postService.clearPosts();
  };
};