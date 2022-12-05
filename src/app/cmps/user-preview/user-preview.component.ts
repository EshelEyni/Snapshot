import { Story } from './../../models/story.model';
import { StoryService } from './../../services/story.service';
import { UserService } from 'src/app/services/user.service';
import { MiniUser } from './../../models/user.model';
import { Component, OnInit, inject } from '@angular/core';
import { Location } from 'src/app/models/post.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss'],
  inputs: ['user', 'location', 'story']
})
export class UserPreviewComponent implements OnInit {

  constructor() { }
  userService = inject(UserService);
  storyService = inject(StoryService);
  user!: MiniUser;
  location!: Location;
  story!: Story;
  isWatched: boolean = false;
  url: string =  '';

  async ngOnInit() {

    if (this.user && this.story) {
      this.isWatched = this.story.watchedBy.some(watchedUser => watchedUser.id === this.user.id);
      this.url = `/story/${this.story.id}`;
    }

    // const user = await lastValueFrom(this.userService.getById(this.user.id));
    // const story = await lastValueFrom(this.storyService.getById(user.currStoryId));
    // this.isWatched = this.story.watchedBy.some(watchedUser => watchedUser.id === this.user.id);
    // this.url = `/story/${story.id}`;
    // console.log('this.url', this.url);
    // this.story = story;
  }

  setWatchedStory() {
    if(this.isWatched) return;
    this.story.watchedBy.push(this.user);
    this.storyService.save(this.story);
    this.isWatched = true;
  }
}
