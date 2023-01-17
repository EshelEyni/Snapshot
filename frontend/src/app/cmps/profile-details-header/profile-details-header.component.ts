import { User } from './../../models/user.model';
import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'profile-details-header',
  templateUrl: './profile-details-header.component.html',
  styleUrls: ['./profile-details-header.component.scss'],
  inputs: ['user','isCurrUserLoggedInUser'],
  outputs: ['openModal']
})
export class ProfileDetailsHeaderComponent implements OnInit {

  constructor() { }
  $location = inject(Location);
  user!: User;
  openModal = new EventEmitter();
  isCurrUserLoggedInUser!: boolean;
  faChevronLeft = faChevronLeft;

  ngOnInit(): void {
  }

  onOpenModal() {
    this.openModal.emit()
  }

  onGoBack() {
    this.$location.back()
  }

}
