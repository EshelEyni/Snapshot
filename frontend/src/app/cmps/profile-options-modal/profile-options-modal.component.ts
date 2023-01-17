import { Component, EventEmitter, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'profile-options-modal',
  templateUrl: './profile-options-modal.component.html',
  styleUrls: ['./profile-options-modal.component.scss'],
  inputs: ['user'],
  outputs: ['closeModal']
})
export class ProfileOptionsModalComponent implements OnInit {

  constructor() { }
  user!: User;
  faChevronLeft = faChevronLeft;
  closeModal = new EventEmitter();
  ngOnInit(): void {
  }

  onCloseModal() {
    this.closeModal.emit()
  }

}
