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
  inputs: ['story', 'isHighlight',   'isLinkToStoryEdit'],
  outputs: ['setPrevStory', 'setNextStory']
})
export class StoryPreviewComponent implements OnInit, OnDestroy {

  constructor(  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }
  userService = inject(UserService);
  store = inject(Store<State>);
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;
  story!: Story;
  isHighlight!: boolean;
  isLinkToStoryEdit!: boolean;

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user }
      }
    })
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}