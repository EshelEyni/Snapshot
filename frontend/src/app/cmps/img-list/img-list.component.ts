import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'img-list',
  templateUrl: './img-list.component.html',
  styleUrls: ['./img-list.component.scss'],
  inputs: ['imgUrls'],
  outputs: ['uploadedImgUrls', 'removeImg','imgSelected']
})
export class ImgListComponent implements OnInit {

  constructor() { }

  isImgSelect: boolean = false;
  imgUrls: string[] = []
  uploadedImgUrls = new EventEmitter<string[]>();
  removeImg = new EventEmitter<number>();
  imgSelected = new EventEmitter<number>();

  ngOnInit(): void {
  }


  onToggleImgSelect() {
    this.isImgSelect = !this.isImgSelect;
  }

  onRemoveImg(url: string) {
    const idx = this.imgUrls.indexOf(url);
    this.imgUrls.splice(idx, 1);
    this.removeImg.emit(idx);
    if (!this.imgUrls.length) {
      this.isImgSelect = false;
      return
    }
  }

  onImgSelected(idx: number) {
    this.imgSelected.emit(idx);
  }

  onSaveFiles(imgUrls: string[]) {
    this.imgUrls = [...this.imgUrls, ...imgUrls];
    this.uploadedImgUrls.emit(imgUrls);
  }

}
