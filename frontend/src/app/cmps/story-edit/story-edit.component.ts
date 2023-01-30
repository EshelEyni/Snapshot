import { UserService } from './../../services/user.service';
import { User } from './../../models/user.model';
import { Observable, map, Subscription } from 'rxjs';
import { State } from './../../store/store';
import { Component, OnInit, inject } from '@angular/core';
import { StoryImg } from 'src/app/models/story.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'story-edit',
  templateUrl: './story-edit.component.html',
  styleUrls: ['./story-edit.component.scss']
})
export class StoryEditComponent implements OnInit {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  };

  store = inject(Store<State>);
  userService = inject(UserService);

  storyImgs: StoryImg[] = [];

  loggedinUser!: User;
  sub!: Subscription;
  loggedinUser$: Observable<User | null>;

  isUploading: boolean = false;

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user };
      };
    });
  };

  onToggleIsUploading(): void {
    this.isUploading = !this.isUploading;
  };

  onSetFiles(imgUrls: string[]): void {
    this.storyImgs = imgUrls.map(imgUrl => ({ url: imgUrl, items: [] }));
  };
};