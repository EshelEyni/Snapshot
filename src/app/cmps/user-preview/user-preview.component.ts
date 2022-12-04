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
  inputs: ['user', 'location']
})
export class UserPreviewComponent implements OnInit {

  constructor() { }
  userService = inject(UserService);
  storyService = inject(StoryService);
  user!: MiniUser;
  location!: Location;
  story!: Story;

  async ngOnInit() {
    const user = await lastValueFrom(this.userService.getById(this.user.id));
    const story = await lastValueFrom(this.storyService.getById(user.currStoryId));
    this.story = story;
  }

  setWatchedStory(storyId: string) {

  }
}
