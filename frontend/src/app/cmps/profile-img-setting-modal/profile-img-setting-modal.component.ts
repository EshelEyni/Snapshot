import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'profile-img-setting-modal',
  templateUrl: './profile-img-setting-modal.component.html',
  styleUrls: ['./profile-img-setting-modal.component.scss'],
  outputs: ['closeModal', 'removeImg', 'imgSelected']
})
export class ProfileImgSettingModalComponent implements OnInit {

  constructor() { };


  imgSelected = new EventEmitter<any>();
  closeModal = new EventEmitter();
  removeImg = new EventEmitter();

  ngOnInit(): void { };

  onImgSelected(event: Event): void {
    this.imgSelected.emit(event);
  };

  onRemoveImg(): void {
    this.removeImg.emit();
  };

  onCloseModal(): void {
    this.closeModal.emit();
  };
};