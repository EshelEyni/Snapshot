import { User } from './../../models/user.model';
import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'profile-details-header',
  templateUrl: './profile-details-header.component.html',
  styleUrls: ['./profile-details-header.component.scss'],
  inputs: ['user'],
  outputs: ['openModal']
})
export class ProfileDetailsHeaderComponent implements OnInit {

  constructor() { }
  user!: User;
  openModal = new EventEmitter();

  ngOnInit(): void {
  }

  onOpenModal() {
    this.openModal.emit()
  }

}
