import { Observable, Subscription, map } from 'rxjs';
import { User } from './../../models/user.model';
import { Store } from '@ngrx/store';
import { State } from './../../store/store';

import { Story } from './../../models/story.model';
import { Component, OnInit, EventEmitter, OnChanges, OnDestroy, inject } from '@angular/core';

@Component({
  selector: 'story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  inputs: ['story', 'isCurrStory', 'nextStory', 'isPaginationBtnShown', 'isLinkToStoryEdit'],
  outputs: ['setPrevStory', 'setNextStory','imgChange']
})
export class StoryComponent implements OnInit, OnChanges, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }

  store = inject(Store<State>);
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;
  setPrevStory = new EventEmitter<number>();
  setNextStory = new EventEmitter<number>();
  imgChange = new EventEmitter<number>();
  story!: Story;
  nextStory!: Story;
  isCurrStory!: boolean;
  currImgUrl = '';
  currImgIdx = 0;
  isUserStory!: boolean;
  isPaginationBtnShown!: { left: boolean, right: boolean };
  isPlaying: boolean = true;
  isOptionsModalShown: boolean = false;
  isSentMsgShown: boolean = false;

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user }
        if (this.story) this.isUserStory = this.loggedinUser.id === this.story.by.id
      }
    })
  }

  ngOnChanges() {
    if (this.story) {
      if (this.loggedinUser) this.isUserStory = this.loggedinUser.id === this.story.by.id
      this.currImgIdx = 0;
      this.currImgUrl = this.story.imgUrls.length ? this.story.imgUrls[this.currImgIdx] : '';
    }
  }
  onSetCurrImgUrl(num: number) {
    this.currImgIdx = this.currImgIdx + num;
    this.imgChange.emit(this.currImgIdx)
    if (this.currImgIdx < 0) {
      this.setPrevStory.emit(-1);
      return;
    }
    if (this.currImgIdx > this.story.imgUrls.length - 1) {
      this.setNextStory.emit(1);
      return;
    }
    this.currImgUrl = this.story.imgUrls[this.currImgIdx];
  }

  onToggleOptionsModal() {
    this.isOptionsModalShown = !this.isOptionsModalShown;
    this.onToggleIsPlaying();
  }

  onSetSentMsg() {
    this.isSentMsgShown = true
    setTimeout(() => {
      this.isSentMsgShown = false;
    }, 1000);
  }

  onToggleIsPlaying() {
    this.isPlaying = !this.isPlaying;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}
