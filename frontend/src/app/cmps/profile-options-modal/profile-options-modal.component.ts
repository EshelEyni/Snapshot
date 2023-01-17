import { UserService } from './../../services/user.service';
import { LoadLoggedInUser } from './../../store/actions/user.actions';
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
  outputs: ['closeModal']
})
export class ProfileOptionsModalComponent implements OnInit {

  constructor() { }
  router = inject(Router)
  store = inject(Store<State>)
  userService = inject(UserService)
  loggedinUser!: User;
  faChevronLeft = faChevronLeft;
  closeModal = new EventEmitter();
  isDarkMode!: boolean;

  ngOnInit(): void {
    this.isDarkMode = this.loggedinUser.isDarkMode;

  }

  onCloseModal() {
    this.closeModal.emit()
  }

  onGoToProfileEdit() {
    this.router.navigate(['/profile-edit/', this.loggedinUser.id])
  }

  onGoToChangePassword() {
    this.router.navigate(['/profile-edit/', this.loggedinUser.id], { queryParams: { filterBy: 'changePassword' } })
  }

  onToggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

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

    this.store.dispatch(new SaveUser({...this.loggedinUser, isDarkMode: this.isDarkMode}));
  }

  onLogout() {
    this.store.dispatch(new LoadLoggedInUser(0));
    this.userService.logout()
    this.router.navigate(['/login'])
  }
}
