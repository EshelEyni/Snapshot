import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'post-canvas',
  templateUrl: './post-canvas.component.html',
  styleUrls: ['./post-canvas.component.scss'],
  inputs: ['imgUrls']
})
export class PostCanvasComponent implements OnInit {

  constructor() { }
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  imgUrls!: string[];
  currImgIdx = 0;
  currImgUrl: string = '';
  isPaginationBtnShown = { left: false, right: false };
  isAspectRatioModalShown = false;
  isMainScreenShown = false;
  isZoomModalShown = false;
  scale = 1;

  ngOnInit(): void {
    const canvas = this.canvas.nativeElement;
    if (canvas.getContext) this.ctx = canvas.getContext('2d')!;
    this.currImgUrl = this.imgUrls[0];
    this.setCanvas();
    this.setPaginationBtns();
  }

  setCanvas() {
    const img = new Image();
    img.src = this.currImgUrl;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.scale(this.scale, this.scale);
      this.ctx.drawImage(img, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }


  setPaginationBtns() {
    const currIdx = this.imgUrls.indexOf(this.currImgUrl);
    if (currIdx === 0) this.isPaginationBtnShown.left = false;
    else this.isPaginationBtnShown.left = true;
    if (currIdx === this.imgUrls.length - 1) this.isPaginationBtnShown.right = false;
    else this.isPaginationBtnShown.right = true;
  }


  onRemoveImg(idx: number) {
    console.log('onRemoveImg');
    if (idx === this.currImgIdx) {
      this.currImgIdx--;
      this.onSetCurrImg(this.currImgIdx);
    }
    this.imgUrls.splice(idx, 1);
  }

  onAddImg(imgUrls: string[]) {
    this.imgUrls = [...this.imgUrls, ...imgUrls];
    this.currImgIdx = this.imgUrls.length - 1;
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.onSetCurrImg(this.currImgIdx);
  }

  onSetCurrImg(num: number, isFromPaginationBtn: boolean = false) {
    if (this.canvas) this.currImgUrl = this.canvas.nativeElement.toDataURL("image/png");
    if (isFromPaginationBtn) this.currImgIdx += num;
    else this.currImgIdx = num;
    if (this.currImgIdx < 0) this.currImgIdx = 0;
    if (this.currImgIdx > this.imgUrls.length - 1) this.currImgIdx = this.imgUrls.length - 1;
    this.currImgUrl = this.imgUrls[this.currImgIdx];
    this.setCanvas();
    this.setPaginationBtns();
  }

  onToggleModal(el: string) {
    switch (el) {
      case 'aspect-ratio':
        this.isAspectRatioModalShown = !this.isAspectRatioModalShown;
        break;
      case 'zoom':
        this.isZoomModalShown = !this.isZoomModalShown;
        break;
      case 'main-screen':
        if (this.isZoomModalShown) this.isZoomModalShown = !this.isZoomModalShown;
        if (this.isAspectRatioModalShown) this.isAspectRatioModalShown = !this.isAspectRatioModalShown;
        break;

      default:
        break;
    }
    this.isMainScreenShown = !this.isMainScreenShown;
  }

  onSetAspectRatio(aspectRatio: string) {
    console.log('onSetAspectRatio');
    console.log(aspectRatio);
    const canvas = this.canvas.nativeElement;
    switch (aspectRatio) {
      case 'Original':
        canvas.width = 830;
        canvas.height = 830;
        canvas.style.borderRadius = '0 0 12px 12px';
        break;
      case '1:1':
        canvas.width = 830;
        canvas.height = 830;
        canvas.style.borderRadius = '0 0 12px 12px';
        break;
      case '4:5':
        canvas.width = 664;
        canvas.height = 830;
        canvas.style.borderRadius = '0';
        break;
      case '16:9':
        canvas.width = 830;
        canvas.height = 467;
        canvas.style.borderRadius = '0';
        break;
      default:
        break;
    }
    this.setCanvas();
  }

  onSetZoom(zoom: number) {
    console.log('onSetZoom');
    console.log(zoom);
    const ratio = 1 + (zoom / 100);
    console.log(ratio);
    this.scale = ratio;
    // this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.setCanvas();
  }

}
