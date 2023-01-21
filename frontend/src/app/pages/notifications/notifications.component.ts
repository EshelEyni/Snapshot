import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user.model';
import { NotificationService } from './../../services/notification.service';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {


  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }

  store = inject(Store<State>)
  notificationService = inject(NotificationService);
  $location = inject(Location);

  notifications$!: Observable<Notification[]>;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  sub!: Subscription;

  faChevronLeft = faChevronLeft;

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user }
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  
  onGoBack() {
    this.$location.back()
  }

}
