import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'profile-edit-header',
  templateUrl: './profile-edit-header.component.html',
  styleUrls: ['./profile-edit-header.component.scss']
})
export class ProfileEditHeaderComponent implements OnInit {

  constructor() { };

  $location = inject(Location);
  faChevronLeft = faChevronLeft;

  ngOnInit(): void { };

  onGoBack(): void {
    this.$location.back();
  };
};
