import { UserService } from 'src/app/services/user.service';
import { AuthService } from './../../services/auth.service';
import { LoadLoggedInUser, RemoveUser } from './../../store/actions/user.actions';
import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { SaveUser } from 'src/app/store/actions/user.actions';
import { Store } from '@ngrx/store';
import { State } from './../../store/store'

@Component({
  selector: 'profile-options-modal',
  templateUrl: './profile-options-modal.component.html',
  styleUrls: ['./profile-options-modal.component.scss'],
  inputs: ['loggedinUser'],
  outputs: ['close']
})
export class ProfileOptionsModalComponent implements OnInit {

  constructor() { }
  router = inject(Router)
  store = inject(Store<State>)
  authService = inject(AuthService)
  userService = inject(UserService)

  faChevronLeft = faChevronLeft;

  loggedinUser!: User;

  isDarkMode!: boolean;
  isConfirmDeleteMsgShown: boolean = false;

  close = new EventEmitter();

  ngOnInit(): void {
    this.isDarkMode = this.loggedinUser.isDarkMode;
  };

  onCloseModal(): void {
    this.close.emit();
  };

  onToggleConfirmDelete(): void {
    this.isConfirmDeleteMsgShown = !this.isConfirmDeleteMsgShown;
  };

  async onDeleteUser(): Promise<void> {
    this.onLogout();
    this.store.dispatch(new RemoveUser(this.loggedinUser.id));
  };

  onGoToProfileEdit(): void {
    this.router.navigate(['/profile-edit/', this.loggedinUser.id]);
  };

  onToggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.documentElement.style.setProperty('--primary-bg', 'rgb(18, 18, 18)');
      document.documentElement.style.setProperty('--secondary-bg', 'rgb(0, 0, 0)');
      document.documentElement.style.setProperty('--primary-color', 'rgb(250, 250, 250)');
      document.documentElement.style.setProperty('--input-bg-color', 'rgb(38, 38, 38)');
    }
    else {
      document.documentElement.style.setProperty('--primary-bg', 'rgb(250, 250, 250)');
      document.documentElement.style.setProperty('--secondary-bg', 'rgb(255, 255, 255)');
      document.documentElement.style.setProperty('--primary-color', 'rgb(38, 38, 38)');
      document.documentElement.style.setProperty('--input-bg-color', 'rgb(239, 239, 239)');
    };

    this.store.dispatch(new SaveUser({ ...this.loggedinUser, isDarkMode: this.isDarkMode }));
  };

  onLogout(): void {
    this.store.dispatch(new LoadLoggedInUser(0));
    this.authService.logout();
  };
};