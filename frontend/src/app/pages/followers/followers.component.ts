import { FollowService } from './../../services/follow.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { MiniUser } from 'src/app/models/user.model';

@Component({
  selector: 'followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit, OnDestroy {
  constructor() {}

  $location = inject(Location);
  route = inject(ActivatedRoute);
  followService = inject(FollowService);

  faChevronLeft = faChevronLeft;

  userSub!: Subscription;
  users: MiniUser[] = [];

  async ngOnInit(): Promise<void> {
    this.userSub = this.route.data.subscribe(async (data) => {
      const user = data['user'];
      if (user) {
        this.users = await this.followService.getFollowers(user.id);
      }
    });
  }

  onGoBack(): void {
    this.$location.back();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
