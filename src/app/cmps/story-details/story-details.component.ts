import { Store } from '@ngrx/store';
import { State } from './../../store/store';
import { UserService } from './../../services/user.service';
import { LoadLoggedInUser } from './../../store/actions/user.actions';
import { Story } from './../../models/story.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss']
})
export class StoryDetailsComponent implements OnInit {

  constructor(
    private $location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private store: Store<State>
  ) { }


  story!: Story;
  paramsSubscription!: Subscription;

  ngOnInit(): void {
    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));

    this.paramsSubscription = this.route.data.subscribe(data => {
      const story = data['story']
      if (story) this.story = story
    })
  }

  onGoBack() {
    this.$location.back();
  }
}
