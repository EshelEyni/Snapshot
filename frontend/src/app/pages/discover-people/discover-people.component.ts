import { LoadUsers, LoadLoggedInUser } from './../../store/actions/user.actions';
import { UserService } from 'src/app/services/user.service';
import { MiniUser } from './../../models/user.model';
import { Observable, Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from './../../store/store';
import { Location } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'discover-people',
  templateUrl: './discover-people.component.html',
  styleUrls: ['./discover-people.component.scss']
})
export class DiscoverPeopleComponent implements OnInit, OnDestroy {

  constructor() {
    this.users$ = this.store.select('userState').pipe(map((x => x.users)));
  };

  $location = inject(Location);
  store = inject(Store<State>);
  userService = inject(UserService);

  faChevronLeft = faChevronLeft;

  subUsers: Subscription | null = null;
  users$: Observable<MiniUser[]>;
  users: MiniUser[] = [];

  ngOnInit(): void {
    const loggedinUser = this.userService.getLoggedinUser();
    if (loggedinUser) {

      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
    
      this.store.dispatch(new LoadUsers({
        userId: loggedinUser.id,
        type:'suggested',
        limit: 100,
      })); 
    };
      
    this.subUsers = this.users$.subscribe(users => {
      if (users) this.users = [...users];
    });
  };

  onGoBack(): void {
    this.$location.back()
  };

  ngOnDestroy(): void {
    this.subUsers?.unsubscribe();
  };
};