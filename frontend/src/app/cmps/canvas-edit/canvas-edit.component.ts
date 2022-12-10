import { CanvasSticker, CanvasStroke, CanvasTxt, Position } from './../../models/canvas.model';
import { StoryImg } from './../../models/story.model';
import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { faNoteSticky, } from '@fortawesome/free-regular-svg-icons';
import { faL, faPaintbrush, faT, faTrashCan } from '@fortawesome/free-solid-svg-icons';

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
  faTrashCan = faTrashCan;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  imgUrls: StoryImg[] = [];
  img = new Image();
  currImgIdx = 0;
  isEditMode = { txt: false, sticker: true, painter: false };
  isDefaultMode = false;
  isDeleteAreaShown = false;
  mousePos = { x: 0, y: 0 };
  isPaginationBtnShown = { left: false, right: false };
  currTxt !: CanvasTxt;
  isDrawing = false;
  stroke: CanvasStroke = { size: 2, color: 'rgb(255, 255, 255)', shadowBlur: 0, pos: [], type: 'stroke', strokeType: 'pen' }
  painterHistory: any[] = [];
  painterHistoryIdx = 0;

  ngOnInit(): void {
    const canvas = this.canvas.nativeElement;
    if (canvas.getContext) this.ctx = canvas.getContext('2d')!;
    this.setCanvas();
    this.setPaginationBtns();
  }

  setCanvas() {
    const canvas = this.canvas.nativeElement;
    this.img.src = this.imgUrls[this.currImgIdx].url;
    this.img.crossOrigin = "Anonymous";
    this.img.onload = () => {
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);

      this.imgUrls[this.currImgIdx].items.forEach(item => {
        if (item.type === 'txt') {
          this.ctx.fillStyle = item.style.color;
          this.ctx.strokeStyle = item.style.color;
          this.ctx.font = `${item.style['font-size']} ${item.style['font-family']}`;
          if (!item.isDragging) {
            this.ctx.fillText(item.str, item.rect.x, item.rect.y, canvas.width);
          } else {
            this.ctx.fillText(item.str, this.mousePos.x - item.rect.width / 2, this.mousePos.y + item.rect.height / 2, canvas.width);
          }
        }

        if (item.type === 'stroke') {
          if (item.strokeType !== 'spray') {
            this.ctx.beginPath();
            this.ctx.moveTo(item.pos[0].x - canvas.offsetLeft, item.pos[0].y - canvas.offsetTop);
            item.pos.forEach((pos: Position, idx: number) => {
              if (idx === 0) return;
              this.ctx.lineTo(pos.x - canvas.offsetLeft, pos.y - canvas.offsetTop);
            });
            this.ctx.strokeStyle = item.color;
            this.ctx.lineWidth = item.size;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.shadowColor = item.color;
            this.ctx.shadowBlur = item.shadowBlur;
            this.ctx.stroke();
            this.ctx.closePath();
            if (item.strokeType === 'arrow') {
              this.onDrawArrow(item.pos[item.pos.length - 5].x, item.pos[item.pos.length - 5].y, item.pos[item.pos.length - 1].x, item.pos[item.pos.length - 1].y);
            }
          } else {
            item.pos.forEach((pos: Position) => {
              this.onDrawSpray(pos.x, pos.y);
            });
          }
        }

        if (item.type === 'sticker') {
          const image = new Image();
          image.src = item.url;
          image.crossOrigin = 'Anonymous';
          image.onload = () => {
            this.ctx.drawImage(image, this.mousePos.x - item.rect.width / 2, this.mousePos.y + item.rect.height / 2, item.rect.width+ item.rect.width / 2, item.rect.height+ item.rect.height / 2);
          }
        }
      });
    }
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    event.preventDefault();
    this.mousePos = { x: event.offsetX, y: event.offsetY };
    if (this.isDefaultMode) {

      if (!this.imgUrls[this.currImgIdx].items.length) return;

      this.imgUrls[this.currImgIdx].items.forEach(item => {
        if (this.getIsItemPos(item)) {
          if (item.isDragging) {
            this.setCanvas();

            if (item.type === 'txt') {
              item.rect.x = this.mousePos.x - item.rect.width / 2;
              item.rect.y = this.mousePos.y + item.rect.height / 2;
              if (item.rect.x < 0) item.rect.x = 0;
              if (item.rect.x > this.canvas.nativeElement.width - item.rect.width) item.rect.x = this.canvas.nativeElement.width - item.rect.width;
              if (item.rect.y < item.rect.height) item.rect.y = item.rect.height;
              if (item.rect.y > this.canvas.nativeElement.height) item.rect.y = this.canvas.nativeElement.height;
            } else if (item.type === 'sticker') {
              item.rect.x = this.mousePos.x - item.rect.width / 2;
              item.rect.y = this.mousePos.y - item.rect.height / 2;
              if (item.rect.x < 0) item.rect.x = 0;
              // if (item.rect.x > this.canvas.nativeElement.width - item.rect.width) item.rect.x = this.canvas.nativeElement.width - item.rect.width;
              if (item.rect.y < 0) item.rect.y = 0;
              // if (item.rect.y > this.canvas.nativeElement.height - item.rect.height) item.rect.y = this.canvas.nativeElement.height - item.rect.height;
            }


            if (this.isDeleteAreaShown && this.mousePos.y > 885) {
              this.onRemoveItem(item);
              this.canvas.nativeElement.style.cursor = 'default';
            }
          }
          else {
            this.canvas.nativeElement.style.cursor = 'grab';
          }
        }
        else this.canvas.nativeElement.style.cursor = 'default';
      });

    }

    if (this.isEditMode.painter && this.isDrawing) this.onDraw();
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    event.preventDefault();
    if (this.isDefaultMode) {
      this.mousePos = { x: event.offsetX, y: event.offsetY };
      this.imgUrls[this.currImgIdx].items.forEach(item => {
        if (this.getIsItemPos(item)) {
          this.canvas.nativeElement.style.cursor = 'grabbing';
          item.isDragging = true;
          this.isDeleteAreaShown = true;
        }
      });
    }
    if (this.isEditMode.painter) {
      if (this.mousePos.y > 50 && this.mousePos.x > 50 && this.mousePos.x < 475) this.onStartDraw();
    }
  }


  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    event.preventDefault();
    if (this.isDefaultMode) {
      this.mousePos = { x: event.offsetX, y: event.offsetY };
      const item = this.imgUrls[this.currImgIdx].items.find(item => item.isDragging);
      if (!item) return;

      if (item) {
        item.rect.x = this.mousePos.x - item.rect.width / 2;
        item.rect.y = this.mousePos.y + item.rect.height / 2;
      }
      if (this.isDeleteAreaShown && this.mousePos.y > 885) {
        this.onRemoveItem(item);
      }
      this.imgUrls[this.currImgIdx].items.forEach(item => {
        item.isDragging = false;
      });
      this.isDeleteAreaShown = false;
      this.canvas.nativeElement.style.cursor = 'default';
      this.setCanvas();
    }
    if (this.isEditMode.painter) this.onStopDraw();
  }

  @HostListener('dblclick', ['$event']) onMouseLeave(event: MouseEvent) {
    event.preventDefault();
    this.mousePos = { x: event.offsetX, y: event.offsetY };

    if (this.imgUrls[this.currImgIdx].items.length === 0) return;
    this.imgUrls[this.currImgIdx].items.forEach(item => {
      if (item.type === 'stroke') return;
      if (this.getIsItemPos(item)) {
        this.onToggleEdit(item.type);
        this.onRemoveItem(item);
        this.currTxt = item;
      }
    });
  }

  onStartDraw() {
    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(this.mousePos.x, this.mousePos.y);
    this.onSaveStrokePos();
  }

  onDraw() {
    if (this.isDrawing) {
      if (this.stroke.strokeType !== 'spray') {
        this.ctx.lineTo(this.mousePos.x, this.mousePos.y);

        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowColor = this.stroke.color;
        this.ctx.shadowBlur = this.stroke.shadowBlur;
        this.ctx.lineWidth = this.stroke.size;
      }
      this.ctx.strokeStyle = this.stroke.color;

      if (this.stroke.strokeType === 'spray') this.onDrawSpray(this.mousePos.x, this.mousePos.y);
      if (this.stroke.strokeType !== 'highlighter' && this.stroke.strokeType !== 'spray') this.ctx.stroke();

      this.onSaveStrokePos();
    }
  }

  onStopDraw() {
    if (this.isDrawing) {
      this.ctx.stroke();
      this.ctx.closePath();
      this.isDrawing = false;
      this.onSaveStrokePos();
      if (this.stroke.strokeType === 'arrow') this.onDrawArrow(this.stroke.pos[this.stroke.pos.length - 5].x, this.stroke.pos[this.stroke.pos.length - 5].y, this.stroke.pos[this.stroke.pos.length - 1].x, this.stroke.pos[this.stroke.pos.length - 1].y);
      this.imgUrls[this.currImgIdx].items = [...this.imgUrls[this.currImgIdx].items, { ...this.stroke }];
      this.stroke.pos = [];
    }
  }

  onDrawArrow(fromx: number, fromy: number, tox: number, toy: number) {
    const dx = tox - fromx;
    const dy = toy - fromy;
    const headlen = 35;
    const angle = Math.atan2(dy, dx);
    this.ctx.beginPath();
    this.ctx.moveTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.lineTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.stroke();
  }

  onDrawSpray(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.stroke.size, 0, Math.PI * 2)
    this.ctx.fillStyle = this.stroke.color;
    for (var i = 20; i--;) {
      this.ctx.rect(x + Math.random() * 20 - 10,
        y + Math.random() * 20 - 10, 1, 1);

      this.ctx.fill();
    }
    this.ctx.closePath();
  }

  onSaveStrokePos() {
    this.stroke.pos.push({ x: this.mousePos.x, y: this.mousePos.y });
  }

  onUndoStroke() {
    const items = [...this.imgUrls[this.currImgIdx].items];
    let idx = items.reverse().findIndex(item => item.type === 'stroke');
    idx = items.length - idx - 1;
    if (idx === -1) return;
    this.imgUrls[this.currImgIdx].items.splice(idx, 1);
    this.setCanvas();
  }

  onStrokeChange(obj: { key: string, value: string | number }) {
    if (typeof obj.value === 'string') {
      if (obj.key === 'color') this.stroke.color = obj.value;
      if (obj.key === 'strokeType') this.stroke.strokeType = obj.value;
    }
    if (typeof obj.value === 'number') {
      if (obj.key === 'size') this.stroke.size = obj.value;
      if (obj.key === 'shadowBlur') this.stroke.shadowBlur = obj.value;
    }
  }

  onRemoveItem(item: any) {
    const idx = this.imgUrls[this.currImgIdx].items.indexOf(item);
    this.imgUrls[this.currImgIdx].items.splice(idx, 1);
    this.canvas.nativeElement.style.cursor = 'default';
    this.isDeleteAreaShown = false;
    this.setCanvas();
  }

  onAddTxt(txt: any) {
    const canvas = this.canvas.nativeElement;
    this.ctx.fillStyle = txt.style.color;
    this.ctx.strokeStyle = txt.style.color;
    this.ctx.font = `${txt.style['font-size']} ${txt.style['font-family']}`;
    this.ctx.fillText(txt.str, txt.rect.x, txt.rect.y, canvas.width);
    txt.rect.width = this.ctx.measureText(txt.str).width + 10;
    this.imgUrls[this.currImgIdx].items = [...this.imgUrls[this.currImgIdx].items, txt];
    this.onToggleEdit('txt');
  }

  onAddSticker(sticker: CanvasSticker) {
    const image = new Image();
    image.src = sticker.url;
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      this.ctx.drawImage(image, sticker.rect.x, sticker.rect.y, sticker.rect.width, sticker.rect.height);
    }
    this.imgUrls[this.currImgIdx].items = [...this.imgUrls[this.currImgIdx].items, sticker];
    this.onToggleEdit('sticker');
  }

  getIsItemPos(item: { type: string; rect: { x: number; width: any; y: number; height: number; }; }): boolean | void {
    if (item.type === 'stroke') return false;
    if (item.type === 'txt') return this.mousePos.x > item.rect.x && this.mousePos.x < item.rect.x + item.rect.width
      && this.mousePos.y > item.rect.y - item.rect.height && this.mousePos.y < item.rect.y;
    if (item.type === 'sticker') return this.mousePos.x > item.rect.x && this.mousePos.x < item.rect.x + item.rect.width
      && this.mousePos.y > item.rect.y && this.mousePos.y < item.rect.y + item.rect.height;
  }

  setPaginationBtns() {
    if (this.currImgIdx === 0) this.isPaginationBtnShown.left = false;
    else this.isPaginationBtnShown.left = true;
    if (this.currImgIdx === this.imgUrls.length - 1) this.isPaginationBtnShown.right = false;
    else this.isPaginationBtnShown.right = true;
  }

  onSetCurrImgUrl(num: number) {
    this.currImgIdx += num;
    if (this.currImgIdx < 0) this.currImgIdx = 0;
    if (this.currImgIdx > this.imgUrls.length - 1) this.currImgIdx = this.imgUrls.length - 1;
    this.setCanvas();
    this.setPaginationBtns();
  }

  onToggleEdit(inputName: string) {
    switch (inputName) {
      case 'txt':
        this.isEditMode.txt = !this.isEditMode.txt;
        this.isEditMode.sticker = false;
        this.isEditMode.painter = false;
        break;
      case 'sticker':
        this.isEditMode.txt = false;
        this.isEditMode.sticker = !this.isEditMode.sticker;
        this.isEditMode.painter = false;
        break;
      case 'painter':
        this.isEditMode.txt = false;
        this.isEditMode.sticker = false;
        this.isEditMode.painter = !this.isEditMode.painter;
        break;
      default:
        break;
    }
    this.isDefaultMode = !this.isDefaultMode;
  }
}
