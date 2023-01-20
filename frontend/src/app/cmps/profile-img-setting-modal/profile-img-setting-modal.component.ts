import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'profile-img-setting-modal',
  templateUrl: './profile-img-setting-modal.component.html',
  styleUrls: ['./profile-img-setting-modal.component.scss'],
  inputs: ['onImgSelected'],
  outputs: ['closeModal', 'removeImg']
})
export class ProfileImgSettingModalComponent implements OnInit {

  constructor() { }

  closeModal = new EventEmitter();
  removeImg = new EventEmitter();
  onImgSelected!: Function;

  ngOnInit(): void {
  }

  onRemoveImg() {
    this.removeImg.emit()
  }

  onCloseModal() {
    this.closeModal.emit()
  }
}
