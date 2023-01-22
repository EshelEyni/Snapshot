import { User } from './../../models/user.model';
import { map, Subscription, Observable } from 'rxjs';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));

  }

  store = inject(Store<State>);
  $location = inject(Location);
  userSub!: Subscription;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  users: User[] = [];
  faChevronLeft = faChevronLeft;
  isShareModalShown = false;

  ngOnInit(): void {
    this.userSub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = user;
      }
    })
  }

  onToggleShareModal() {
    this.isShareModalShown = !this.isShareModalShown;
  }


  onGoBack() {
    this.$location.back()
  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
