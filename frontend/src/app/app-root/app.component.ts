import { LoadLoggedInUser } from './../store/actions/user.actions';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from './../store/store';
import { UserService } from 'src/app/services/user.service';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  }
  userService = inject(UserService);
  store = inject(Store<State>);
  socketService = inject(SocketService);

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  subLoggedinUSer: Subscription | null = null;
  isDarkMode!: boolean;

  async ngOnInit() {
    this.socketService.setup();
    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
    }

    this.subLoggedinUSer = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = {...user};
        this.isDarkMode = this.loggedinUser.isDarkMode;
        this.setDarkMode();
      }
    });
  }

  setDarkMode() {
    if (this.isDarkMode) {
      document.documentElement.style.setProperty('--primary-bg', 'rgb(18, 18, 18)');
      document.documentElement.style.setProperty('--secondary-bg', 'rgb(0, 0, 0)');
      document.documentElement.style.setProperty('--primary-color', 'rgb(250, 250, 250)');
    }
    else {
      document.documentElement.style.setProperty('--primary-bg', 'rgb(250, 250, 250)');
      document.documentElement.style.setProperty('--secondary-bg', 'rgb(255, 255, 255)');
      document.documentElement.style.setProperty('--primary-color', 'rgb(38, 38, 38)');
    }
  }

  ngOnDestroy(): void {
    this.subLoggedinUSer?.unsubscribe();
    this.socketService.terminate();
  }

}