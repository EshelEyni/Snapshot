import { AuthService } from './../../services/auth.service';
import { SvgIconComponent } from 'angular-svg-icon';
import { LoadLoggedInUser, SaveUser } from './../../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { State } from './../../store/store';
import { User } from './../../models/user.model';
import { Router } from '@angular/router';
import { Component, OnInit, inject, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'side-bar-options-modal',
  templateUrl: './side-bar-options-modal.component.html',
  styleUrls: ['./side-bar-options-modal.component.scss'],
  inputs: ['loggedinUser']
})
export class SideBarOptionsModalComponent implements OnInit {

  constructor() { };

  @ViewChildren('svgIcon') icons!: QueryList<SvgIconComponent>;

  router = inject(Router);
  authService = inject(AuthService);
  store = inject(Store<State>);

  loggedinUser!: User;

  isDarkMode!: boolean;
  iconColor: string = 'var(--tertiary-color)';

  ngOnInit(): void {
    this.isDarkMode = this.loggedinUser.isDarkMode;
    setTimeout(() => {
      this.setIconColor();
    }, 0);
  };

  setIconColor(): void {
    this.iconColor = this.loggedinUser.isDarkMode ? 'var(--primary-color)' : 'var(--tertiary-color)';
    this.icons.forEach(icon => {
      icon.svgStyle = { color: this.iconColor, fill: this.iconColor };
    });
  };


  onGoToProfileEdit(): void {
    this.router.navigate(['/profile-edit/', this.loggedinUser.id]);
  };

  onGoToSavedPosts() {
    this.router.navigate(['/profile/', this.loggedinUser.id], { queryParams: { filterBy: 'savedPosts' } });
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

    this.loggedinUser.isDarkMode = this.isDarkMode;
    this.store.dispatch(new SaveUser(this.loggedinUser));
  };

  onLogout(): void {
    this.store.dispatch(new LoadLoggedInUser(0));
    this.authService.logout();
  };
};