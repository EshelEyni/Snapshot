import { User } from './../../models/user.model';
import { Observable, Subscription, map } from 'rxjs';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { UserService } from './../../services/user.service';
import { Story } from './../../models/story.model';
import { Component, EventEmitter, OnInit, OnChanges, inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'story-preview',
  templateUrl: './story-preview.component.html',
  styleUrls: ['./story-preview.component.scss'],
  inputs: ['story', 'isHighlight', 'isStoryDetails', 'isCurrStory', 'nextStory', 'isPaginationBtnShown', 'isLinkToStoryEdit'],
  outputs: ['setPrevStory', 'setNextStory']
})
export class StoryPreviewComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private store: Store<State>

  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }
  userService = inject(UserService);

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  setPrevStory = new EventEmitter<number>();
  setNextStory = new EventEmitter<number>();
  story!: Story;
  isHighlight!: boolean;
  isStoryDetails!: boolean;
  isLinkToStoryEdit!: boolean;
  isCurrStory!: boolean;
  nextStory!: Story;
  isPaginationBtnShown!: { left: boolean, right: boolean };
  currImgUrl = '';
  currImgIdx = 0;
  isUserStory!: boolean;

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
        if (this.story) this.isUserStory = this.loggedinUser.id === this.story.by.id
      }
    })
  }

  ngOnChanges() {
    if (this.story) {
      if (this.loggedinUser) this.isUserStory = this.loggedinUser.id === this.story.by.id
      this.currImgIdx = 0;
      this.currImgUrl = this.story.imgUrls.length ? this.story.imgUrls[this.currImgIdx].url : '';
    }
  }

  onSetCurrImgUrl(num: number) {
    this.currImgIdx = this.currImgIdx + num;
    if (this.currImgIdx < 0) {
      this.setPrevStory.emit(-1);
      return;
    }
    if (this.currImgIdx > this.story.imgUrls.length - 1) {
      this.setNextStory.emit(1);
      return;
    }
    this.currImgUrl = this.story.imgUrls[this.currImgIdx].url;

  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
