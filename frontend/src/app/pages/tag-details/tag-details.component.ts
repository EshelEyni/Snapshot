import { TagService } from './../../services/tag.service';
import { Location } from '@angular/common';
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
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.scss']
})
export class TagDetailsComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  };

  $location = inject(Location);
  postService = inject(PostService);
  userService = inject(UserService);
  tagService = inject(TagService);
  route = inject(ActivatedRoute);
  store = inject(Store<State>);

  faChevronLeft = faChevronLeft;

  paramsSubscription!: Subscription;
  tag!: Tag;
  posts$!: Observable<Post[]>;

  userSub: Subscription | null = null;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;

  ngOnInit(): void {

    this.userSub = this.loggedinUser$.subscribe(user => {
      if (user) this.loggedinUser = { ...user };
    });

    this.paramsSubscription = this.route.data.subscribe(data => {
      const tag = data['tag'];
      if (tag) {
        this.tag = { ...tag };
        this.postService.loadPosts(
          {
            type: 'tagDetailsPagePosts',
            tagName: tag.name,
            limit: 1000,
          }
        );

        this.posts$ = this.postService.posts$;
      };
    });
  };

  onGoBack(): void {
    this.$location.back();
  };

  ngOnDestroy(): void {
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
    if (this.userSub) this.userSub.unsubscribe();
    this.postService.clearPosts();
  };
};