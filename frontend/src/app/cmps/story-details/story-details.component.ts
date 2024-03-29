import { StoryService } from './../../services/story.service';
import { NavigationService } from './../../services/navigation.service';
import { UserService } from './../../services/user.service';
import { Story } from './../../models/story.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss'],
})
export class StoryDetailsComponent implements OnInit {
  constructor() {}

  userService = inject(UserService);
  storyService = inject(StoryService);
  navigation = inject(NavigationService);
  route = inject(ActivatedRoute);

  paramsSubscription!: Subscription;
  story!: Story;

  ngOnInit(): void {
    this.paramsSubscription = this.route.data.subscribe((data) => {
      const story = data['story'];
      if (story) {
        this.story = story;
        this.storyService.addStoryView(this.story.id);
      }
    });
  }

  onGoBack(): void {
    this.navigation.storyDetailsGoBack();
  }
}
