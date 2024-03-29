import { User } from './../../models/user.model';
import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';

@Component({
  selector: 'profile-details-header',
  templateUrl: './profile-details-header.component.html',
  styleUrls: ['./profile-details-header.component.scss'],
  inputs: ['user', 'isLoggedinUserProfile'],
  outputs: ['openModal']
})
export class ProfileDetailsHeaderComponent implements OnInit {

  constructor() { };

  $location = inject(Location);
  router = inject(Router);

  faChevronLeft = faChevronLeft;

  user!: User;

  isLoggedinUserProfile!: boolean;

  openModal = new EventEmitter();

  ngOnInit(): void { };

  onOpenModal(): void {
    this.openModal.emit();
  };

  onGoToDiscoverPeople(): void {
    this.router.navigate(['/discover-people']);
  };

  onGoBack(): void {
    this.$location.back();
  };
};