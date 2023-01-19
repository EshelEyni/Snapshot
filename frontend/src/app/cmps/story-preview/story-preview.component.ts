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
  inputs: ['story', 'type', 'isLinkToStoryEdit'],
  outputs: ['setPrevStory', 'setNextStory']
})
export class StoryPreviewComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }
  userService = inject(UserService);
  store = inject(Store<State>);
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;
  story!: Story;
  type!: string;
  isLinkToStoryEdit!: boolean;
  hightlightStoryPickerDate!: { day: string, month: string, year: string }

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user }
      }
    })
    this.setHightlightStoryPickerDate(this.story.createdAt);
  }


  setHightlightStoryPickerDate(timeStamp: Date) {
    const date = new Date(timeStamp);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    this.hightlightStoryPickerDate = {
      day: date.getDate().toString(),
      month: monthNames[date.getMonth()],
      year: date.getFullYear().toString()
    }

  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}