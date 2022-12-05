import { Component, inject, Input, OnInit, OnChanges } from '@angular/core';
import { faCircle, faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import { UploadImgService } from 'src/app/services/upload-img.service';

@Component({
  selector: 'img-container',
  templateUrl: './img-container.component.html',
  styleUrls: ['./img-container.component.scss']
})
export class ImgContainerComponent implements OnInit, OnChanges {

  constructor() { }
  uploadImgService = inject(UploadImgService)

  @Input() imgUrls: string[] = []
  @Input() onGoBack!: Function;
  @Input() onFileChange!: Function;
  @Input() saveFiles!: Function;
  @Input() isEditPost!: boolean;
  @Input() isMiniPreview!: boolean;

  // Icons
  faCircle = faCircle;
  faCircleChevronLeft = faCircleChevronLeft;
  faCircleChevronRight = faCircleChevronRight;

  currImgUrl: string = '';
  isPaginationBtnShown = { left: false, right: false };
  isImgSelect: boolean = false;

  ngOnInit(): void {
    this.currImgUrl = this.imgUrls[0];
    this.setPaginationBtns();
  }

  ngOnChanges() {
    this.currImgUrl = this.imgUrls[0];
    this.setPaginationBtns();
  }

  setPaginationBtns() {
    const currIdx = this.imgUrls.indexOf(this.currImgUrl);
    if (currIdx === 0) this.isPaginationBtnShown.left = false;
    else this.isPaginationBtnShown.left = true;
    if (currIdx === this.imgUrls.length - 1) this.isPaginationBtnShown.right = false;
    else this.isPaginationBtnShown.right = true;
  }

  onSwitchImg(num: number) {
    const currIdx = this.imgUrls.indexOf(this.currImgUrl);
    if (num === 1) this.currImgUrl = this.imgUrls[currIdx + 1];
    else if (num === -1) this.currImgUrl = this.imgUrls[currIdx - 1];
    this.setPaginationBtns();
  }

  onToggleImgSelect() {
    this.isImgSelect = !this.isImgSelect;
  }

  onRemoveImg(img: string) {
    const idx = this.imgUrls.indexOf(img);
    this.imgUrls.splice(idx, 1);
    if (!this.imgUrls.length) {
      this.isImgSelect = false;
      this.currImgUrl = '';
      this.onGoBack();
      return
    }
    this.currImgUrl = this.imgUrls[idx - 1];
    this.setPaginationBtns();
  }

}
