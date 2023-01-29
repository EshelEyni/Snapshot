import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { StoryService } from './../../services/story.service';
import { Observable, Subscription, map } from 'rxjs';
import { Story } from './../../models/story.model';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, inject, OnChanges, OnDestroy, EventEmitter } from '@angular/core';

@Component({
  selector: 'story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
  inputs: ['currStory', 'type'],
  outputs: ['storySelected']
})

export class StoryListComponent implements OnInit, OnChanges, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  };

  store = inject(Store<State>);
  userService = inject(UserService);
  storyService = inject(StoryService);
  router = inject(Router);

  type!: 'home-page' | 'profile-details' | 'story-details' | 'highlight-story-picker';

  loggedinUserSub: Subscription | null = null;
  storySub: Subscription | null = null;

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  currStory!: Story; // the story that is currently being viewed in the story-details page.
  preCurrStoryList: Story[] = [];
  postCurrStoryList: Story[] = [];
  stories!: Story[];

  isLinkToStoryEdit = false;
  isPaginationBtnShown = { left: false, right: false };
  isStorySelectedForHighlight: { idx: number, isSelected: boolean }[] = [];

  listPosition: string = '0';
  idx: number = 0; // index of the current story in the list or the index of the image in the story.

  storySelected = new EventEmitter<Story | null>();

  ngOnInit(): void {

    this.loggedinUserSub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user };
        if (user.currStoryId) this.isLinkToStoryEdit = false;
        else this.isLinkToStoryEdit = true;

        this.storyService.loadStories({ userId: user.id, type: this.type });
      };
    });

    if (this.type !== 'profile-details') {
      this.storySub = this.storyService.stories$.subscribe(stories => {
        this.stories = stories;

        switch (this.type) {
          case 'story-details':
            this.preCurrStoryList = stories.slice(0, stories.findIndex(s => s.id === this.currStory.id));
            this.postCurrStoryList = stories.slice(stories.findIndex(s => s.id === this.currStory.id) + 1);
            break;
          case 'highlight-story-picker':
            this.isStorySelectedForHighlight = stories.map((s, idx) => {
              return { idx, isSelected: false };
            });
            break;
        }

        this.setPaginationBtns(stories);
      });
    }
    else {
      this.storySub = this.storyService.highlightedStories$.subscribe(stories => {
        this.stories = stories;
        this.setPaginationBtns(stories);
      });
    };

  };

  ngOnChanges(): void {
    if (this.currStory && this.stories && this.preCurrStoryList) {
      this.preCurrStoryList = this.stories.slice(0, this.stories.findIndex(story => story.id === this.currStory.id));
      this.postCurrStoryList = this.stories.slice(this.stories.findIndex(story => story.id === this.currStory.id) + 1);
      this.idx = this.preCurrStoryList.length;
      this.setPaginationBtns(this.stories);
    };
  };

  setPaginationBtns(stories: Story[]): void {

    if (this.type === 'story-details') {
      if (this.preCurrStoryList.length === 0) this.isPaginationBtnShown.left = false;
      else this.isPaginationBtnShown.left = true;

      if (!this.postCurrStoryList.length) this.isPaginationBtnShown.right = false;
      else this.isPaginationBtnShown.right = true;
    }
    else {
      if (this.idx === 0) this.isPaginationBtnShown.left = false;
      else this.isPaginationBtnShown.left = true;

      if (this.idx === stories.length - 4 && window.innerWidth > 400) this.isPaginationBtnShown.right = false;
      else this.isPaginationBtnShown.right = true;

      if (this.idx === stories.length - 3 && window.innerWidth < 400) this.isPaginationBtnShown.right = false;
      else this.isPaginationBtnShown.right = true;
    };
  };

  onSetCurrStoryImgIdx(idx: number): void {
    this.idx = idx;
    this.setPaginationBtns(this.stories);
  };

  onScrollStoryList(num: number): void {
    this.idx += num;
    if (this.idx < 0) this.idx = 0;
    if (this.idx > this.stories.length - 1) this.idx = this.stories.length - 1;
    this.listPosition = `${-this.idx * 17.5}%`;
    this.setPaginationBtns(this.stories);
  };

  onSetCurrStory(num: number): void {
    const currStoryIdx = this.preCurrStoryList.length + num;
    this.router.navigate(['/story/', this.stories[currStoryIdx].id]);
  };

  onPickStoryForHighlights(idx: number): void {
    if (!this.isStorySelectedForHighlight[idx].isSelected) {
      this.isStorySelectedForHighlight.forEach(story => story.isSelected = false);
      this.isStorySelectedForHighlight[idx].isSelected = true;
      this.storySelected.emit(this.stories[idx]);
    }
    else {
      this.isStorySelectedForHighlight[idx].isSelected = false;
      this.storySelected.emit(null);
    };
  };

  ngOnDestroy(): void {
    this.loggedinUserSub?.unsubscribe();
    this.storySub?.unsubscribe();
  };
};