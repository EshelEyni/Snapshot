import { Story } from './../../models/story.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';


@Component({
  selector: 'story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss']
})
export class StoryDetailsComponent implements OnInit {

  constructor(
    private $location: Location,
    private route: ActivatedRoute,
  ) { }

  story!: Story;
  paramsSubscription!: Subscription;

  ngOnInit(): void {
    this.paramsSubscription = this.route.data.subscribe(data => {
      const story = data['story']
      if (story) this.story = story
    })
  }

  onGoBack() {
    this.$location.back();
  }
}
