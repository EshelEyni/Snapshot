import { TagService } from './../../services/tag.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MiniUser } from './../../models/user.model';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit, OnDestroy {

  constructor() { }
  $location = inject(Location);
  route = inject(ActivatedRoute)
  userService = inject(UserService);
  tagService = inject(TagService);

  faChevronLeft = faChevronLeft;
  users: MiniUser[] = [];
  tags: Tag[] = [];
  sub!: Subscription;
  filterBy = { usersShown: false, tagsShown: true }
  isNoFollowingMsgShown = false;

  ngOnInit(): void {
    this.sub = this.route.data.subscribe(async data => {
      const user = data['user']
      if (user) {
        this.users = await this.userService.getFollowings(user.id);
        this.tags = await this.tagService.getfollowedTags(user.id);
        console.log(this.tags);
        if (this.users.length === 0) {
          this.isNoFollowingMsgShown = true;
        }
      }
    })
  }

  onSetFilter(filterBy: string) {
    console.log(filterBy);
    if (filterBy === 'people') {
      this.filterBy = { usersShown: true, tagsShown: false }
      this.isNoFollowingMsgShown = this.users.length === 0;
    } else {
      this.filterBy = { usersShown: false, tagsShown: true }
      this.isNoFollowingMsgShown = this.tags.length === 0;
    }
  }

  onGoBack() {
    this.$location.back()
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
