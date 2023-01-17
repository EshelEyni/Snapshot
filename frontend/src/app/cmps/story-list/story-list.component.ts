import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { MiniUser } from './../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { StoryService } from './../../services/story.service';
import { Observable, Subscription, map, lastValueFrom } from 'rxjs';
import { Story } from './../../models/story.model';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, inject, OnChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
  inputs: ['isHighlight', 'currStory', 'type']
})
export class StoryListComponent implements OnInit, OnChanges, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }

  store = inject(Store<State>);
  userService = inject(UserService);
  storyService = inject(StoryService);
  router = inject(Router);

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User
  loggedinUserSub: Subscription | null = null;
  storySub: Subscription | null = null;
  idx: number = 0;
  isLinkToStoryEdit = false;

  isHighlight!: boolean;
  currStory!: Story;
  preCurrStoryList: Story[] = [];
  postCurrStoryList: Story[] = [];
  stories!: Story[];
  isPaginationBtnShown = { left: false, right: false };
  listPosition: string = '0';

  type!: string;

  ngOnInit(): void {
    this.loggedinUserSub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = {...user};
        if (user.currStoryId) this.isLinkToStoryEdit = false;
        else this.isLinkToStoryEdit = true;
        this.storyService.loadStories(user.id);
      }
    });

    this.storySub = this.storyService.stories$.subscribe(stories => {
      this.stories = stories;
      if (this.type === 'story-details') {
        stories = stories.filter(story => story.id);
        this.preCurrStoryList = stories.slice(0, stories.findIndex(story => story.id === this.currStory.id));
        this.postCurrStoryList = stories.slice(stories.findIndex(story => story.id === this.currStory.id) + 1);
        this.idx = this.preCurrStoryList.length;
      }
      this.setPaginationBtns(stories);
    });

  }

  ngOnChanges() {
    if (this.currStory && this.stories && this.preCurrStoryList) {
      this.preCurrStoryList = this.stories.slice(0, this.stories.findIndex(story => story.id === this.currStory.id));
      this.postCurrStoryList = this.stories.slice(this.stories.findIndex(story => story.id === this.currStory.id) + 1);
      this.idx = this.preCurrStoryList.length;
      this.setPaginationBtns(this.stories);
    }
  }


  setPaginationBtns(stories: Story[]) {
    if (this.idx === 0) this.isPaginationBtnShown.left = false;
    else this.isPaginationBtnShown.left = true;
    if (this.currStory) {
      if (this.idx === this.currStory.imgUrls.length - 1) this.isPaginationBtnShown.right = false;
      else this.isPaginationBtnShown.right = true;
    }
    else {
      if (this.idx === stories.length - 4) this.isPaginationBtnShown.right = false;
      else this.isPaginationBtnShown.right = true;
    }
  }

  onScrollStory(num: number) {
    this.idx += num;
    if (this.idx < 0) this.idx = 0;
    if (this.idx > this.stories.length - 1) this.idx = this.stories.length - 1;
    this.listPosition = `${-this.idx * 17.5}%`;
    this.setPaginationBtns(this.stories);
  }

  onSetCurrStory(num: number) {
    this.router.navigate(['/story/', this.stories[this.idx + num].id]);
  }

  ngOnDestroy() {
    this.loggedinUserSub?.unsubscribe();
    this.storySub?.unsubscribe();
  }

}
