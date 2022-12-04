import { User } from 'src/app/models/user.model';
import { MiniUser } from './../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { StoryService } from './../../services/story.service';
import { Observable, Subscription, map } from 'rxjs';
import { Story } from './../../models/story.model';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
  inputs: ['isHighlight']
})
export class StoryListComponent implements OnInit {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User
  sub: Subscription | null = null;
  isHighlight!: boolean;
  store = inject(Store<State>);
  userService = inject(UserService);
  storyService = inject(StoryService);
  stories$!: Observable<Story[]>;

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      this.loggedinUser = JSON.parse(JSON.stringify(user));
      if (user) {
        const usersIds = [user.id, ...this.loggedinUser.following.map((user: MiniUser) => user.id)];
        this.storyService.loadStories(usersIds);
        this.stories$ = this.storyService.stories$;
      }
    });
  }

}
