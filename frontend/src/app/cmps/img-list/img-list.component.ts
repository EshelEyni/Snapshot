import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'img-list',
  templateUrl: './img-list.component.html',
  styleUrls: ['./img-list.component.scss'],
  inputs: ['imgUrls'],
  outputs: ['uploadedImgUrls', 'removeImg', 'imgSelected']
})
export class ImgListComponent implements OnInit {

  constructor() { };

  imgUrls: string[] = [];

  isImgSelect: boolean = false;

  uploadedImgUrls = new EventEmitter<string[]>();
  removeImg = new EventEmitter<number>();
  imgSelected = new EventEmitter<number>();

  ngOnInit(): void { };


  onToggleImgSelect(): void {
    this.isImgSelect = !this.isImgSelect;
  };

  onRemoveImg(url: string): void {
    const idx = this.imgUrls.indexOf(url);
    this.removeImg.emit(idx);
    if (!this.imgUrls.length) {
      this.isImgSelect = false;
      return;
    };
  };

  onImgSelected(idx: number): void {
    this.imgSelected.emit(idx);
  };

  onSaveFiles(imgUrls: string[]): void {
    this.imgUrls = [...this.imgUrls, ...imgUrls];
    this.uploadedImgUrls.emit(imgUrls);
  };
};