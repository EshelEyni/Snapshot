import { Component, Input, OnInit } from '@angular/core';
import { faCircle, faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'img-container',
  templateUrl: './img-container.component.html',
  styleUrls: ['./img-container.component.scss']
})
export class ImgContainerComponent implements OnInit {

  constructor() { }
  @Input() imgUrls: string[] = []

  // Icons
  faCircle = faCircle;
  faCircleChevronLeft = faCircleChevronLeft;
  faCircleChevronRight = faCircleChevronRight;

  currImgUrl: string = '';
  isPaginationBtnShown = { left: false, right: false };

  ngOnInit(): void {
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
}
