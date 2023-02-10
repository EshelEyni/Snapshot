import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user.model';
import { NotificationService } from './../../services/notification.service';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {


  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  };

  store = inject(Store<State>);
  notificationService = inject(NotificationService);
  $location = inject(Location);

  faChevronLeft = faChevronLeft;

  sub!: Subscription;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  notifications$!: Observable<Notification[]>;

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user };
        this.notificationService.loadNotifications();
        this.notifications$ = this.notificationService.notifications$;
      };
    });
  };

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  };


  onGoBack(): void {
    this.$location.back();
  };
};