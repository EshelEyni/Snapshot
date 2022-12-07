import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { faNoteSticky } from '@fortawesome/free-regular-svg-icons';
import { faPaintbrush, faT } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'canvas-edit',
  templateUrl: './canvas-edit.component.html',
  styleUrls: ['./canvas-edit.component.scss'],
  inputs: ['imgUrls']
})
export class CanvasEditComponent implements OnInit {

  constructor() { }

  // Icons
  faNoteSticky = faNoteSticky;
  faPaintbrush = faPaintbrush;
  faT = faT;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  imgUrls: string[] = [];
  img = new Image();
  currImgIdx = 0;
  isTxtEditMode: boolean = true;

  isPaginationBtnShown = { left: false, right: false };


  ngOnInit(): void {
    this.setImgToCanvas();
    this.setPaginationBtns();
  }

  onToggleTxtEdit() {
    this.isTxtEditMode = !this.isTxtEditMode;
  }

  onSetTxt() {
    // this.onAddTxt();
  }

  onAddTxt(txtProp: any) {
    const canvas = this.canvas.nativeElement;
    if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      ctx!.fillStyle = 'white';
      ctx!.strokeStyle = 'white';
      ctx!.font = '30px Arial';
      ctx!.fillText(txtProp.txt , 20, 150);
    }
  }


  onSetCurrImgUrl(num: number) {
    this.currImgIdx += num;
    if (this.currImgIdx < 0) this.currImgIdx = 0;
    if (this.currImgIdx > this.imgUrls.length - 1) this.currImgIdx = this.imgUrls.length - 1;

    this.setImgToCanvas();
    this.setPaginationBtns();
  }

  setImgToCanvas() {
    const canvas = this.canvas.nativeElement;
    if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      this.img.src = this.imgUrls[this.currImgIdx];
      this.img.onload = () => ctx?.drawImage(this.img, 0, 0, canvas.width, canvas.height);
    }
  }

  setPaginationBtns() {
    if (this.currImgIdx === 0) this.isPaginationBtnShown.left = false;
    else this.isPaginationBtnShown.left = true;
    if (this.currImgIdx === this.imgUrls.length - 1) this.isPaginationBtnShown.right = false;
    else this.isPaginationBtnShown.right = true;
  }
}
