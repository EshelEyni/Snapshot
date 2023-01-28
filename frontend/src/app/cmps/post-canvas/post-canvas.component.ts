import { PostCanvasImg } from './../../models/post.model';
import { UploadImgService } from './../../services/upload-img.service';
import { Component, OnInit, ViewChild, ElementRef, HostListener, OnChanges, inject } from '@angular/core';

@Component({
  selector: 'post-canvas',
  templateUrl: './post-canvas.component.html',
  styleUrls: ['./post-canvas.component.scss'],
  inputs: ['postImgs', 'currSettings', 'currFilter']
})
export class PostCanvasComponent implements OnInit, OnChanges {

  constructor() { }

  uploadImgService = inject(UploadImgService)
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  postImgs!: PostCanvasImg[];
  imgUrls: string[] = [];
  currPostImg!: PostCanvasImg;

  currSettings!: string;
  currFilter!: string;
  currAspectRatio: string = 'Original';
  canvasSize: number = 830;
  currImgIdx = 0;
  isPaginationBtnShown = { left: false, right: false };
  isAspectRatioModalShown = false;
  isMainScreenShown = false;
  isZoomModalShown = false;
  isDragging = false;
  dragPos = { x: 0, y: 0 };
  initialDragPos = { x: 0, y: 0 };

  ngOnInit(): void {
    const canvas = this.canvas.nativeElement;
    if (canvas.getContext) this.ctx = canvas.getContext('2d')!;
    this.imgUrls = this.postImgs.map(img => img.url);
    this.currPostImg = this.postImgs[0];

    this.postImgs.forEach(img => {
      img.height = img.width = this.canvasSize;
    })

    this.setCanvas();
    this.setPaginationBtns();
  }

  ngOnChanges() {
    console.log('ngOnChanges');
    if (this.currSettings !== 'crop') {
      const canvas = this.canvas.nativeElement;
      canvas.style.cursor = 'default';
    }

    this.setCanvasSize();
    if (this.currPostImg) this.setCanvas();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setCanvasSize();
    this.setCanvas();
  }

  setCanvasSize() {
    if (window.innerWidth > 1260) return;
    this.canvasSize = window.innerWidth;
  }

  setCanvas() {
    const img = new Image();
    img.src = this.currPostImg.url;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.imageSmoothingEnabled = true;
      this.setFilter();
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      if (this.currSettings === 'txt-location') {
        this.ctx.fillStyle = 'rgba(38, 38, 38)';
        this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      }
      const { x, y, width, height } = this.currPostImg;
      this.ctx.drawImage(img, x, y, width, height);
    }
  }

  onSetCurrImg(num: number, isFromPaginationBtn: boolean = false) {
    if (isFromPaginationBtn) this.currImgIdx += num;
    else this.currImgIdx = num;
    if (this.currImgIdx < 0) this.currImgIdx = 0;
    if (this.currImgIdx > this.postImgs.length - 1) this.currImgIdx = this.postImgs.length - 1;
    this.currPostImg = this.postImgs[this.currImgIdx];
    this.setCanvas();
    this.setPaginationBtns();
  }

  setFilter() {
    this.currPostImg.filter = this.currFilter;
    switch (this.currFilter) {
      case 'clarendon':
        this.ctx.filter = 'saturate(1.6) contrast(1.5) brightness(1.1)';
        break;
      case 'gingham':
        this.ctx.filter = 'sepia(1) brightness(1.1) hue-rotate(50deg)';
        break;
      case 'moon':
        this.ctx.filter = 'grayscale(1) brightness(0.9) contrast(1.1)';
        break;
      case 'lark':
        this.ctx.filter = 'brightness(1.2) contrast(1.1) saturate(1.5)';
        break;
      case 'reyes':
        this.ctx.filter = 'brightness(1.1) contrast(1.1) saturate(1.5)';
        break;
      case 'juno':
        this.ctx.filter = 'brightness(1.1) contrast(1.1) saturate(1.3)';
        break;
      case 'slumber':
        this.ctx.filter = 'brightness(0.9) contrast(1.1) saturate(1.3)';
        break;
      case 'crema':
        this.ctx.filter = 'brightness(1.1) contrast(1.1) saturate(1.1)';
        break;
      case 'normal':
        this.ctx.filter = 'none';
        break;
      default:
        this.ctx.filter = 'none';
        break;
    }
  }

  onSetAspectRatio(aspectRatio: string) {
    this.currAspectRatio = aspectRatio;
    this.postImgs.forEach(img => img.aspectRatio = aspectRatio);
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

  async onSetZoom(zoom: number) {
    this.currPostImg.zoom = zoom;
    const canvas = this.canvas.nativeElement;
    const ctx = this.ctx;

    const image = new Image();
    image.src = this.currPostImg.url;
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      ctx.imageSmoothingQuality = "high";
      ctx.imageSmoothingEnabled = true;

      const width = canvas.width + (this.currPostImg.zoom * (canvas.width / canvas.height))
      const height = canvas.height + this.currPostImg.zoom
      const x = canvas.width / 2 - width / 2
      const y = canvas.height / 2 - height / 2

      this.postImgs[this.currImgIdx] = { ...this.postImgs[this.currImgIdx], x, y, width, height };
      this.currPostImg = this.postImgs[this.currImgIdx];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, x, y, width, height);
    }
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    if (this.currSettings !== 'crop') return;
    const canvas = this.canvas.nativeElement;
    canvas.style.cursor = 'grabbing';
    this.isDragging = true;
    if ((e.target as HTMLElement).tagName === 'CANVAS') {
      this.drawLines();
      this.initialDragPos = { x: e.offsetX, y: e.offsetY };
    }
  }

  @HostListener('touchstart', ['$event']) onTouchStart(e: TouchEvent) {
    if (this.currSettings !== 'crop') return;
    const canvas = this.canvas.nativeElement;
    canvas.style.cursor = 'grabbing';
    this.isDragging = true;
    if ((e.target as HTMLElement).tagName === 'CANVAS') {
      this.drawLines();
      this.initialDragPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }


  @HostListener('mousemove', ['$event']) onMouseMove(e: MouseEvent) {
    if (this.currSettings !== 'crop') return;
    this.dragPos = { x: e.offsetX, y: e.offsetY };
    const isCanvas = (e.target as HTMLElement).tagName === 'CANVAS';
    const canvas = this.canvas.nativeElement;
    canvas.style.cursor = 'grab';
    let canvasRect = canvas.getBoundingClientRect();
    let x = e.clientX - canvasRect.left;
    let y = e.clientY - canvasRect.top;
    this.dragPos = { x, y };
    if (this.isDragging && isCanvas) {
      canvas.style.cursor = 'grabbing';
      this.drawDraggedImg();
    }
  }

  @HostListener('touchmove', ['$event']) onTouchMove(e: TouchEvent) {
    if (this.currSettings !== 'crop') return;
    this.dragPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const isCanvas = (e.target as HTMLElement).tagName === 'CANVAS';
    const canvas = this.canvas.nativeElement;
    canvas.style.cursor = 'grab';
    let canvasRect = canvas.getBoundingClientRect();
    let x = e.touches[0].clientX - canvasRect.left;
    let y = e.touches[0].clientY - canvasRect.top;
    this.dragPos = { x, y };
    if (this.isDragging && isCanvas) {
      canvas.style.cursor = 'grabbing';
      this.drawDraggedImg();
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent) {
    if (this.currSettings !== 'crop') return;
    const isCanvas = (e.target as HTMLElement).tagName === 'CANVAS';
    const canvas = this.canvas.nativeElement;
    canvas.style.cursor = 'grab';
    this.isDragging = false;
    if (isCanvas) {

      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawDraggedImg(true);
    }
  }

  @HostListener('touchend', ['$event']) onTouchEnd(e: TouchEvent) {
    if (this.currSettings !== 'crop') return;
    const isCanvas = (e.target as HTMLElement).tagName === 'CANVAS';
    const canvas = this.canvas.nativeElement;
    canvas.style.cursor = 'grab';
    this.isDragging = false;
    if (isCanvas) {

      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawDraggedImg(true);
    }

  }

  drawLines() {
    const canvas = this.canvas.nativeElement;
    let squareSize = canvas.width / 3;

    this.ctx.moveTo(squareSize, 0);
    this.ctx.lineTo(squareSize, canvas.height);
    this.ctx.moveTo(squareSize * 2, 0);
    this.ctx.lineTo(squareSize * 2, canvas.height);

    this.ctx.moveTo(0, squareSize);
    this.ctx.lineTo(canvas.width, squareSize);
    this.ctx.moveTo(0, squareSize * 2);
    this.ctx.lineTo(canvas.width, squareSize * 2);

    this.ctx.strokeStyle = "rgba(255,255,255,0.1)";
    this.ctx.lineWidth = 0.5;
    this.ctx.stroke();
  }

  drawDraggedImg(isDragEnd = false) {
    const canvas = this.canvas.nativeElement;
    const image = new Image();
    image.src = this.currPostImg.url;
    image.crossOrigin = "Anonymous";
    image.onload = () => {

      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.imageSmoothingEnabled = true;

      let x, y, width, height;

      if (this.currPostImg.zoom) {

        width = canvas.width + (this.currPostImg.zoom * (canvas.width / canvas.height));
        height = canvas.height + this.currPostImg.zoom;

        x = this.currPostImg.x + (this.initialDragPos.x - this.dragPos.x) * -1;
        y = this.currPostImg.y + (this.initialDragPos.y - this.dragPos.y) * -1;

      }
      else {
        width = canvas.width;
        height = canvas.height;
        x = (canvas.width / 2 - this.dragPos.x) * -1;
        y = (canvas.height / 2 - this.dragPos.y) * -1;
      }

      this.ctx.drawImage(image, x, y, width, height);

      if (isDragEnd) {

        if (!this.currPostImg.zoom) {
          x = 0;
          y = 0;
        }
        else {
          if (x > 0) x = 0;
          if (y > 0) y = 0;
          if (x + width < canvas.width) x = canvas.width - width;
          if (y + height < canvas.height) y = canvas.height - height;
        }

        this.postImgs[this.currImgIdx] = { ...this.postImgs[this.currImgIdx], x, y, width, height };
        this.currPostImg = this.postImgs[this.currImgIdx];
        console.log(this.currPostImg);
        this.ctx.drawImage(image, x, y, width, height);
      }
      else {
        this.drawLines();
      }
    }
  }

  onRemoveImg(idx: number) {
    if (idx === this.currImgIdx) {
      this.currImgIdx--;
      this.onSetCurrImg(this.currImgIdx);
    }
    this.postImgs.splice(idx, 1);
  }

  onAddImg(imgUrls: string[]) {
    const imgs = imgUrls.map((url) => ({
      url,
      filter: 'normal',
      aspectRatio: 'Original',
      zoom: 0,
      x: 0,
      y: 0,
      width: this.canvas.nativeElement.width,
      height: this.canvas.nativeElement.height,
    }));

    this.postImgs = [...this.postImgs, ...imgs];
    this.currImgIdx = this.postImgs.length - 1;
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.onSetCurrImg(this.currImgIdx);
  }

  setPaginationBtns() {
    const currIdx = this.postImgs.indexOf(this.currPostImg);
    if (currIdx === 0) this.isPaginationBtnShown.left = false;
    else this.isPaginationBtnShown.left = true;
    if (currIdx === this.postImgs.length - 1) this.isPaginationBtnShown.right = false;
    else this.isPaginationBtnShown.right = true;
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

}