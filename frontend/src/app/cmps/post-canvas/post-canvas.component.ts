import { Component, OnInit, ViewChild, ElementRef, HostListener, OnChanges } from '@angular/core';

@Component({
  selector: 'post-canvas',
  templateUrl: './post-canvas.component.html',
  styleUrls: ['./post-canvas.component.scss'],
  inputs: ['imgUrls', 'currSettings', 'currFilter']
})
export class PostCanvasComponent implements OnInit, OnChanges {

  constructor() { }
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  imgUrls!: string[];
  currSettings!: string;
  currFilter!: string;

  currImgIdx = 0;
  currImgUrl: string = '';
  isPaginationBtnShown = { left: false, right: false };
  isAspectRatioModalShown = false;
  isMainScreenShown = false;
  isZoomModalShown = false;
  scale = 1;
  isDragging = false;
  mousePos = { x: 0, y: 0 };
  imgPos = { x: 0, y: 0 };
  zoom = 0;

  ngOnInit(): void {
    const canvas = this.canvas.nativeElement;
    if (canvas.getContext) this.ctx = canvas.getContext('2d')!;
    this.currImgUrl = this.imgUrls[0];
    this.setCanvas();
    this.setPaginationBtns();
  }

  ngOnChanges() {
    this.setCanvas();
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
    if (this.currSettings !== 'crop') return;
    const canvas = this.canvas.nativeElement;
    canvas.style.cursor = 'grabbing';
    this.isDragging = true;
    if ((e.target as HTMLElement).tagName === 'CANVAS') this.drawLines();
  }

  @HostListener('mousemove', ['$event']) onMouseMove(e: MouseEvent) {
    if (this.currSettings !== 'crop') return;
    this.mousePos = { x: e.offsetX, y: e.offsetY };
    const isCanvas = (e.target as HTMLElement).tagName === 'CANVAS';
    const canvas = this.canvas.nativeElement;
    canvas.style.cursor = 'grab';
    let canvasRect = canvas.getBoundingClientRect();
    let x = e.clientX - canvasRect.left;
    let y = e.clientY - canvasRect.top;
    this.mousePos = { x, y };
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

  drawLines() {
    const canvas = this.canvas.nativeElement;
    let squareSize = canvas.width / 3;

    // Draw the vertical lines
    this.ctx.moveTo(squareSize, 0);
    this.ctx.lineTo(squareSize, canvas.height);
    this.ctx.moveTo(squareSize * 2, 0);
    this.ctx.lineTo(squareSize * 2, canvas.height);

    // Draw the horizontal lines
    this.ctx.moveTo(0, squareSize);
    this.ctx.lineTo(canvas.width, squareSize);
    this.ctx.moveTo(0, squareSize * 2);
    this.ctx.lineTo(canvas.width, squareSize * 2);

    // Stroke the lines
    this.ctx.strokeStyle = "rgba(255,255,255,0.1)";
    this.ctx.lineWidth = 0.5;
    this.ctx.stroke();
  }

  drawDraggedImg(isDragEnd = false) {
    const canvas = this.canvas.nativeElement;
    const image = new Image();
    image.src = this.currImgUrl;
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      this.imgPos = { x: this.mousePos.x - (canvas.width / 2), y: this.mousePos.y - (canvas.height / 2) };
      const x = this.imgPos.x;
      const y = this.imgPos.y;

      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.imageSmoothingEnabled = true;
      if (this.zoom) {
        const width = canvas.width + (this.zoom * (canvas.width / canvas.height));
        const height = canvas.height + this.zoom;

        const x = this.imgPos.x - (width - canvas.width) / 2;
        const y = this.imgPos.y - (height - canvas.height) / 2;
        this.ctx.drawImage(image, x, y, width, height);
      } else {
        this.ctx.drawImage(image, x, y, canvas.width, canvas.height);
      }

      if (!isDragEnd) this.drawLines();
    }
  }

  setCanvas(filter = this.currFilter) {
    const img = new Image();
    img.src = this.currImgUrl;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.imageSmoothingEnabled = true;
      if (filter) this.setFilter(filter);
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }

  setFilter = (filter: string) => {
    switch (filter) {
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
    if (this.canvas && isFromPaginationBtn) {
      this.imgUrls[this.currImgIdx] = this.canvas.nativeElement.toDataURL("image/png");
    }
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
    this.zoom = zoom * 10;
    const canvas = this.canvas.nativeElement;
    const ctx = this.ctx;

    const image = new Image();
    image.src = this.currImgUrl;
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      ctx.imageSmoothingQuality = "high";
      ctx.imageSmoothingEnabled = true;

      const width = canvas.width + (this.zoom * (canvas.width / canvas.height))
      const height = canvas.height + this.zoom
      const x = canvas.width / 2 - width / 2
      const y = canvas.height / 2 - height / 2

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, x, y, width, height);
    }
  }

}
