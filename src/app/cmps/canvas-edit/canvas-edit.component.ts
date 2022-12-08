import { CanvasTxt } from './../../models/canvas.model';
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
  isEditMode = { txt: false, sticker: false, brush: false };
  isDefaultMode = true;
  isDeleteAreaShown = false;
  mousePos = { x: 0, y: 0 };
  isPaginationBtnShown = { left: false, right: false };
  currTxt !: CanvasTxt;

  ngOnInit(): void {
    this.setCanvas();
    this.setPaginationBtns();
  }



  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.isDefaultMode) {
      this.mousePos = { x: event.offsetX, y: event.offsetY };
      this.imgUrls[this.currImgIdx].items.forEach(item => {
        if (item.type === 'txt') {
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
        }
      });

    }

    if (this.isEditMode.brush) {
      const canvas = this.canvas.nativeElement;
      if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        ctx!.beginPath();
        ctx!.lineWidth = 5;
        ctx!.lineCap = 'round';
        ctx!.strokeStyle = 'red';
        ctx!.moveTo(event.offsetX, event.offsetY);
        ctx!.lineTo(event.offsetX, event.offsetY);
        ctx!.stroke();
      }
    }

  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    if (this.isDefaultMode) {
      this.mousePos = { x: event.offsetX, y: event.offsetY };
      this.imgUrls[this.currImgIdx].items.forEach(item => {
        if (item.type === 'txt') {
          if (this.mousePos.x > item.rect.x && this.mousePos.x < item.rect.x + item.rect.width &&
            this.mousePos.y > item.rect.y - item.rect.height && this.mousePos.y < item.rect.y) {
            this.canvas.nativeElement.style.cursor = 'grabbing';
            item.isDragging = true;
            this.isDeleteAreaShown = true;
          }
        }
      });
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
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
  }

  @HostListener('dblclick', ['$event']) onMouseLeave(event: MouseEvent) {
    this.mousePos = { x: event.offsetX, y: event.offsetY };

    this.imgUrls[this.currImgIdx].items.forEach(item => {
      if (item.type === 'txt') {
        if (this.mousePos.x > item.rect.x && this.mousePos.x < item.rect.x + item.rect.width &&
          this.mousePos.y > item.rect.y - item.rect.height && this.mousePos.y < item.rect.y) {
          this.onToggleEdit('txt');
          this.onRemoveItem(item);
          this.currTxt = item;
        }
      }
    });
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
        this.isEditMode.brush = false;
        break;
      case 'sticker':
        this.isEditMode.txt = false;
        this.isEditMode.sticker = !this.isEditMode.sticker;
        this.isEditMode.brush = false;
        break;
      case 'brush':
        this.isEditMode.txt = false;
        this.isEditMode.sticker = false;
        this.isEditMode.brush = !this.isEditMode.brush;
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
