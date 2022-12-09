import { CanvasStroke, CanvasTxt } from './../../models/canvas.model';
import { StoryImg } from './../../models/story.model';
import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { faNoteSticky, } from '@fortawesome/free-regular-svg-icons';
import { faPaintbrush, faT, faTrashCan } from '@fortawesome/free-solid-svg-icons';

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
  imgUrls: StoryImg[] = [];
  img = new Image();
  currImgIdx = 0;
  isEditMode = { txt: false, sticker: false, painter: false };
  isDefaultMode = true;
  isDeleteAreaShown = false;
  mousePos = { x: 0, y: 0 };
  isPaginationBtnShown = { left: false, right: false };
  currTxt !: CanvasTxt;
  isPainterActive = false;
  stroke = { size: 2, color: 'red' }
  painterHistory: any[] = [];
  painterHistoryIdx = 0;

  ngOnInit(): void {
    this.setCanvas();
    this.setPaginationBtns();
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (this.isDefaultMode) {
      this.mousePos = { x: event.offsetX, y: event.offsetY };
      this.imgUrls[this.currImgIdx].items.forEach(item => {
        if (this.mousePos.x > item.rect.x && this.mousePos.x < item.rect.x + item.rect.width &&
          this.mousePos.y > item.rect.y - item.rect.height && this.mousePos.y < item.rect.y) {
          if (item.isDragging) {
            this.setCanvas();
            item.rect.x = this.mousePos.x - item.rect.width / 2;
            item.rect.y = this.mousePos.y + item.rect.height / 2;
            if (item.rect.x < 0) item.rect.x = 0;
            if (item.rect.x > this.canvas.nativeElement.width - item.rect.width) item.rect.x = this.canvas.nativeElement.width - item.rect.width;
            if (item.rect.y < item.rect.height) item.rect.y = item.rect.height;
            if (item.rect.y > this.canvas.nativeElement.height) item.rect.y = this.canvas.nativeElement.height;
            if (this.isDeleteAreaShown && this.mousePos.y > 885) {
              this.onRemoveItem(item);
            }

            this.canvas.nativeElement.style.cursor = 'grabbing';
          }
          else {
            this.canvas.nativeElement.style.cursor = 'grab';
          }
        }
        else this.canvas.nativeElement.style.cursor = 'default';
      });

    }

    if (this.isEditMode.painter && this.isPainterActive) {
      const canvas = this.canvas.nativeElement;
      if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        ctx!.beginPath();
        ctx!.arc(event.offsetX, event.offsetY, this.stroke.size, 0, 2 * Math.PI);
        ctx!.shadowBlur = 1000;
        ctx!.fillStyle = this.stroke.color;
        ctx!.fill();
        ctx!.lineWidth = this.stroke.size;
        ctx!.strokeStyle = this.stroke.color;

        ctx!.stroke();
      }
    }

  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    event.preventDefault();
    if (this.isDefaultMode) {
      this.mousePos = { x: event.offsetX, y: event.offsetY };
      this.imgUrls[this.currImgIdx].items.forEach(item => {
        if (this.mousePos.x > item.rect.x && this.mousePos.x < item.rect.x + item.rect.width &&
          this.mousePos.y > item.rect.y - item.rect.height && this.mousePos.y < item.rect.y) {
          this.canvas.nativeElement.style.cursor = 'grabbing';
          item.isDragging = true;
          this.isDeleteAreaShown = true;
        }
      });
    }
    if (this.isEditMode.painter) {
      this.mousePos = { x: event.offsetX, y: event.offsetY };
      if (this.mousePos.y > 50 && this.mousePos.x > 50 && this.mousePos.x < 475) this.isPainterActive = true;
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
    if (this.isEditMode.painter) {
      const canvas = this.canvas.nativeElement;
      if (canvas.getContext) {
        console.log('mouseup');
        let ctx = canvas.getContext('2d');
        ctx!.stroke();
        ctx!.closePath();
        this.painterHistory.push(ctx!.getImageData(0, 0, canvas.width, canvas.height));
        console.log(this.painterHistory);
        this.painterHistoryIdx++;
        console.log(this.painterHistoryIdx);
      }
      this.isPainterActive = false;
    }
  }

  @HostListener('dblclick', ['$event']) onMouseLeave(event: MouseEvent) {
    event.preventDefault();
    this.mousePos = { x: event.offsetX, y: event.offsetY };

    this.imgUrls[this.currImgIdx].items.forEach(item => {
      if (this.mousePos.x > item.rect.x && this.mousePos.x < item.rect.x + item.rect.width &&
        this.mousePos.y > item.rect.y - item.rect.height && this.mousePos.y < item.rect.y) {
        this.onToggleEdit(item.type);
        this.onRemoveItem(item);
        this.currTxt = item;
      }
    });
  }

  onUndoStroke() {
    const canvas = this.canvas.nativeElement;
    if (canvas.getContext) {
      console.log('undo stroke');
      let ctx = canvas.getContext('2d');
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      this.painterHistory.pop();
      this.painterHistoryIdx--;
      if (this.painterHistory.length > 0) {
        ctx!.putImageData(this.painterHistory[this.painterHistoryIdx], 0, 0);
      }
    }
  }

  onStrokeChange(stroke: CanvasStroke) {
    this.stroke = stroke;
  }

  onRemoveItem(item: any) {
    const idx = this.imgUrls[this.currImgIdx].items.indexOf(item);
    this.imgUrls[this.currImgIdx].items.splice(idx, 1);
    this.setCanvas();
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


  onAddTxt(txt: any) {
    const canvas = this.canvas.nativeElement;
    if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      ctx!.fillStyle = txt.style.color;
      ctx!.strokeStyle = txt.style.color;
      ctx!.font = `${txt.style['font-size']} ${txt.style['font-family']}`;
      ctx!.fillText(txt.str, txt.rect.x, txt.rect.y, canvas.width);
      txt.rect.width = ctx!.measureText(txt.str).width + 10;
      this.imgUrls[this.currImgIdx].items = [...this.imgUrls[this.currImgIdx].items, txt];
    }
    this.onToggleEdit('txt');
  }


  onSetCurrImgUrl(num: number) {
    this.currImgIdx += num;
    if (this.currImgIdx < 0) this.currImgIdx = 0;
    if (this.currImgIdx > this.imgUrls.length - 1) this.currImgIdx = this.imgUrls.length - 1;

    this.setCanvas();
    this.setPaginationBtns();
  }

  setCanvas() {
    const canvas = this.canvas.nativeElement;
    if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      this.img.src = this.imgUrls[this.currImgIdx].url;
      this.img.crossOrigin = "Anonymous";

      this.img.onload = () => {

        ctx?.drawImage(this.img, 0, 0, canvas.width, canvas.height);
        this.imgUrls[this.currImgIdx].items.forEach(item => {
          if (item.type === 'txt') {
            ctx!.fillStyle = item.style.color;
            ctx!.strokeStyle = item.style.color;
            ctx!.font = `${item.style['font-size']} ${item.style['font-family']}`;
            if (!item.isDragging) {
              ctx!.fillText(item.str, item.rect.x, item.rect.y, canvas.width);
            } else {
              ctx!.fillText(item.str, this.mousePos.x - item.rect.width / 2, this.mousePos.y + item.rect.height / 2, canvas.width);
            }
          }
        });
      }
    }
  }

  setPaginationBtns() {
    if (this.currImgIdx === 0) this.isPaginationBtnShown.left = false;
    else this.isPaginationBtnShown.left = true;
    if (this.currImgIdx === this.imgUrls.length - 1) this.isPaginationBtnShown.right = false;
    else this.isPaginationBtnShown.right = true;
  }
}
