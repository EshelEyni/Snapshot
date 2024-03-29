import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map, lastValueFrom } from 'rxjs';
import { StoryService } from './../../services/story.service';
import { Router } from '@angular/router';
import { UploadImgService } from './../../services/upload-img.service';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user.model';
import {
  CanvasSticker,
  CanvasStroke,
  CanvasTxt,
  Position,
} from './../../models/canvas.model';
import { StoryImg } from './../../models/story.model';
import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { faNoteSticky } from '@fortawesome/free-regular-svg-icons';
import {
  faPaintbrush,
  faT,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'story-canvas',
  templateUrl: './story-canvas.component.html',
  styleUrls: ['./story-canvas.component.scss'],
  inputs: ['storyImgs'],
})
export class StoryCanvasComponent implements OnInit, OnDestroy {
  constructor() {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser));
  }

  store = inject(Store<State>);
  userService = inject(UserService);
  uploadImgService = inject(UploadImgService);
  router = inject(Router);
  storyService = inject(StoryService);

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('offScreenCanvas', { static: true })
  offScreenCanvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  canvasHeight: number = 0;
  canvasWidth: number = 0;
  stroke: CanvasStroke = {
    size: 2,
    color: 'rgb(255, 255, 255)',
    shadowBlur: 0,
    pos: [],
    type: 'stroke',
    strokeType: 'pen',
  };
  currTxt!: CanvasTxt;
  dragPos = { x: 0, y: 0 };
  painterHistory: any[] = [];
  painterHistoryIdx = 0;

  // Icons
  faNoteSticky = faNoteSticky;
  faPaintbrush = faPaintbrush;
  faT = faT;
  faTrashCan = faTrashCan;

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  sub: Subscription | null = null;

  storyImgs: StoryImg[] = [];
  currStoryImg!: StoryImg;
  currImgIdx: number = 0;
  imgUrls: string[] = [];

  isPaginationBtnShown = { left: false, right: false };
  isEditMode = { txt: false, sticker: false, painter: false };
  isDefaultMode: boolean = true;
  isDeleteAreaShown: boolean = false;
  isDrawing: boolean = false;
  isSaving: boolean = false;

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) this.loggedinUser = { ...user };
    });
    this.currStoryImg = this.storyImgs[this.currImgIdx];
    this.imgUrls = this.storyImgs.map((storyImg) => storyImg.url);
    const canvas = this.canvas.nativeElement;
    if (canvas.getContext) this.ctx = canvas.getContext('2d')!;
    this.setCanvasSize();
    this.setCanvas();
    this.setPaginationBtns();
  }

  setCanvasSize() {
    if (window.innerWidth < 1000) {
      this.canvasHeight = window.innerHeight;
      this.canvasWidth = window.innerWidth;
    } else {
      this.canvasHeight = 900;
      this.canvasWidth = 515;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (
      window.innerWidth > 1000 &&
      this.canvasHeight === 900 &&
      this.canvasWidth === 515
    )
      return;
    this.setCanvasSize();
    this.setCanvas();
  }

  setCanvas(): void {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    const img = new Image();
    img.src = this.currStoryImg.url;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      this.ctx.imageSmoothingQuality = 'high';
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      this.currStoryImg.items.forEach((item) => {
        if (item.type === 'txt') this.setText(item, this.ctx);
        if (item.type === 'stroke') this.setStroke(item, this.ctx);
        if (item.type === 'sticker') this.setSticker(item, this.ctx);
      });
    };
  }

  setText(item: CanvasTxt, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = item.style.color;
    ctx.strokeStyle = item.style.color;
    ctx.font = `${item.style['font-size']} ${item.style['font-family']}`;
    if (!item.isDragging)
      ctx.fillText(
        item.str,
        item.rect.x,
        item.rect.y,
        this.canvas.nativeElement.width
      );
    else
      ctx.fillText(
        item.str,
        this.dragPos.x - item.rect.width / 2,
        this.dragPos.y + item.rect.height / 2,
        this.canvas.nativeElement.width
      );
  }

  setStroke(item: CanvasStroke, ctx: CanvasRenderingContext2D): void {
    if (item.strokeType === 'eraser') return;

    if (item.strokeType !== 'spray') {
      ctx.beginPath();
      ctx.moveTo(item.pos[0].x, item.pos[0].y);
      item.pos.forEach((pos: Position, idx: number) => {
        if (idx === 0) return;
        ctx.lineTo(pos.x, pos.y);
      });

      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = item.color;
      ctx.shadowBlur = item.shadowBlur;
      ctx.stroke();
      ctx.closePath();
      if (item.strokeType === 'arrow') {
        this.onDrawArrow(
          item.pos[item.pos.length - 5].x,
          item.pos[item.pos.length - 5].y,
          item.pos[item.pos.length - 1].x,
          item.pos[item.pos.length - 1].y
        );
      }
    } else {
      item.pos.forEach((pos: Position) => {
        this.onDrawSpray(pos.x, pos.y);
      });
    }
  }

  setSticker(item: CanvasSticker, ctx: CanvasRenderingContext2D): void {
    const image = new Image();
    image.src = item.url;
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      ctx.drawImage(
        image,
        this.dragPos.x - item.rect.width / 2,
        this.dragPos.y - item.rect.height / 2,
        item.rect.width,
        item.rect.height
      );
    };
  }

  setPaginationBtns(): void {
    if (this.currImgIdx === 0) this.isPaginationBtnShown.left = false;
    else this.isPaginationBtnShown.left = true;
    if (this.currImgIdx === this.storyImgs.length - 1)
      this.isPaginationBtnShown.right = false;
    else this.isPaginationBtnShown.right = true;
  }

  onSetCurrStoryImg(num: number, isFromPaginationBtn: boolean = false): void {
    if (this.canvas)
      this.currStoryImg.url = this.canvas.nativeElement.toDataURL('image/png');
    if (isFromPaginationBtn) this.currImgIdx += num;
    else this.currImgIdx = num;
    if (this.currImgIdx < 0) this.currImgIdx = 0;
    if (this.currImgIdx > this.storyImgs.length - 1)
      this.currImgIdx = this.storyImgs.length - 1;
    this.currStoryImg = this.storyImgs[this.currImgIdx];
    this.setCanvas();
    this.setPaginationBtns();
  }

  onRemoveStoryImg(idx: number): void {
    if (this.storyImgs.length === 1) this.router.navigate(['/']);
    if (idx === this.currImgIdx) {
      this.currImgIdx--;
      this.onSetCurrStoryImg(this.currImgIdx);
    }
    this.storyImgs.splice(idx, 1);
  }

  onAddStoryImg(imgUrls: string[]): void {
    const storyImgs = imgUrls.map((imgUrl) => ({ url: imgUrl, items: [] }));
    this.storyImgs = [...this.storyImgs, ...storyImgs];
    this.currImgIdx = this.storyImgs.length - 1;
    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.onSetCurrStoryImg(this.currImgIdx);
  }

  onToggleEdit(inputName: string): void {
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

  onAddTxt(txt: any): void {
    this.ctx.fillStyle = txt.style.color;
    this.ctx.strokeStyle = txt.style.color;
    this.ctx.font = `${txt.style['font-size']} ${txt.style['font-family']}`;
    this.ctx.fillText(
      txt.str,
      txt.rect.x,
      txt.rect.y,
      this.canvas.nativeElement.width
    );
    txt.rect.width = this.ctx.measureText(txt.str).width + 10;
    this.currStoryImg.items = [...this.currStoryImg.items, txt];
    this.onToggleEdit('txt');
  }

  onAddSticker(sticker: CanvasSticker): void {
    const image = new Image();
    image.src = sticker.url;
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      this.ctx.drawImage(
        image,
        sticker.rect.x,
        sticker.rect.y,
        sticker.rect.width,
        sticker.rect.height
      );
    };
    this.currStoryImg.items = [...this.currStoryImg.items, sticker];
    this.onToggleEdit('sticker');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    if (this.isDefaultMode) {
      this.dragPos = { x: event.offsetX, y: event.offsetY };
      this.currStoryImg.items.forEach((item) => {
        if (this.getIsItemPos(item)) {
          this.canvas.nativeElement.style.cursor = 'grabbing';
          item.isDragging = true;
          this.isDeleteAreaShown = true;
        }
      });
    }
    if (this.isEditMode.painter) {
      if (this.dragPos.y > 50 && this.dragPos.x > 50 && this.dragPos.x < 475)
        this.onStartDraw();
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.isDefaultMode) {
      this.dragPos = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      this.currStoryImg.items.forEach((item) => {
        if (this.getIsItemPos(item)) {
          item.isDragging = true;
          this.isDeleteAreaShown = true;
        }
      });
    }
    if (this.isEditMode.painter) {
      if (this.dragPos.y > 50 && this.dragPos.x > 50 && this.dragPos.x < 475)
        this.onStartDraw();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    event.preventDefault();
    this.dragPos = { x: event.offsetX, y: event.offsetY };
    if (this.isDefaultMode) {
      if (!this.currStoryImg.items.length) return;
      this.currStoryImg.items.forEach((item) => {
        if (this.getIsItemPos(item)) {
          if (item.isDragging) {
            this.setCanvas();
            this.onDragItem(item);
            if (this.isDeleteAreaShown && this.dragPos.y > 885) {
              this.onRemoveItem(item);
              this.canvas.nativeElement.style.cursor = 'default';
            }
          } else {
            this.canvas.nativeElement.style.cursor = 'grab';
          }
        } else this.canvas.nativeElement.style.cursor = 'default';
      });
    }

    if (this.isEditMode.painter && this.isDrawing) this.onDraw();
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    this.dragPos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    if (this.isDefaultMode) {
      if (!this.currStoryImg.items.length) return;
      this.currStoryImg.items.forEach((item) => {
        if (this.getIsItemPos(item)) {
          if (item.isDragging) {
            this.setCanvas();
            this.onDragItem(item);
            if (this.isDeleteAreaShown && this.dragPos.y > 885) {
              this.onRemoveItem(item);
              this.canvas.nativeElement.style.cursor = 'default';
            }
          }
        }
      });
    }

    if (this.isEditMode.painter && this.isDrawing) this.onDraw();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    event.preventDefault();
    if (this.isDefaultMode) {
      this.dragPos = { x: event.offsetX, y: event.offsetY };
      const item = this.currStoryImg.items.find((item) => item.isDragging);
      if (!item) return;

      if (item.type === 'txt') {
        item.rect.x = this.dragPos.x - item.rect.width / 2;
        item.rect.y = this.dragPos.y + item.rect.height / 2;
      }
      if (this.isDeleteAreaShown && this.dragPos.y > 885) {
        this.onRemoveItem(item);
      }
      this.currStoryImg.items.forEach((item) => {
        item.isDragging = false;
      });
      this.isDeleteAreaShown = false;
      this.canvas.nativeElement.style.cursor = 'default';
      this.setCanvas();
    }
    if (this.isEditMode.painter) this.onStopDraw();
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (this.isDefaultMode) {
      this.dragPos = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
      const item = this.currStoryImg.items.find((item) => item.isDragging);
      if (!item) return;

      if (item.type === 'txt') {
        item.rect.x = this.dragPos.x - item.rect.width / 2;
        item.rect.y = this.dragPos.y + item.rect.height / 2;
      }
      if (this.isDeleteAreaShown && this.dragPos.y > 885) {
        this.onRemoveItem(item);
      }
      this.currStoryImg.items.forEach((item) => {
        item.isDragging = false;
      });
      this.isDeleteAreaShown = false;
      this.setCanvas();
    }
    if (this.isEditMode.painter) this.onStopDraw();
  }

  @HostListener('dblclick', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    event.preventDefault();
    this.dragPos = { x: event.offsetX, y: event.offsetY };
    if (this.currStoryImg.items.length === 0) return;
    this.currStoryImg.items.forEach((item) => {
      if (item.type === 'stroke') return;
      if (this.getIsItemPos(item)) {
        this.onToggleEdit(item.type);
        this.onRemoveItem(item);
        this.currTxt = item;
      }
    });
  }

  getIsItemPos(item: {
    type: string;
    rect: { x: number; width: any; y: number; height: number };
  }): boolean | void {
    if (item.type === 'stroke') return false;
    if (item.type === 'txt')
      return (
        this.dragPos.x > item.rect.x &&
        this.dragPos.x < item.rect.x + item.rect.width &&
        this.dragPos.y > item.rect.y - item.rect.height &&
        this.dragPos.y < item.rect.y
      );
    if (item.type === 'sticker')
      return (
        this.dragPos.x > item.rect.x &&
        this.dragPos.x < item.rect.x + item.rect.width &&
        this.dragPos.y > item.rect.y &&
        this.dragPos.y < item.rect.y + item.rect.height
      );
  }

  onDragItem(item: CanvasSticker | CanvasTxt): void {
    if (item.type === 'txt') {
      item.rect.x = this.dragPos.x - item.rect.width / 2;
      item.rect.y = this.dragPos.y + item.rect.height / 2;
      if (item.rect.x < 0) item.rect.x = 0;
      if (item.rect.x > this.canvas.nativeElement.width - item.rect.width)
        item.rect.x = this.canvas.nativeElement.width - item.rect.width;
      if (item.rect.y < item.rect.height) item.rect.y = item.rect.height;
      if (item.rect.y > this.canvas.nativeElement.height)
        item.rect.y = this.canvas.nativeElement.height;
    } else if (item.type === 'sticker') {
      item.rect.x = this.dragPos.x - item.rect.width / 2;
      item.rect.y = this.dragPos.y - item.rect.height / 2;
      if (item.rect.x < 0) item.rect.x = 0;
      if (item.rect.y < 0) item.rect.y = 0;
    }
  }

  onStartDraw(): void {
    this.isDrawing = true;
    if (this.stroke.strokeType !== 'eraser') {
      this.ctx.beginPath();
      this.ctx.moveTo(this.dragPos.x, this.dragPos.y);
    } else {
      this.onEraseDrawing();
    }
    this.onSaveStrokePos();
  }

  onDraw(): void {
    if (this.isDrawing) {
      if (
        this.stroke.strokeType !== 'spray' &&
        this.stroke.strokeType !== 'eraser'
      ) {
        this.ctx.lineTo(this.dragPos.x, this.dragPos.y);
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowColor = this.stroke.color;
        this.ctx.shadowBlur = this.stroke.shadowBlur;
        this.ctx.lineWidth = this.stroke.size;
      }
      this.ctx.strokeStyle = this.stroke.color;

      if (this.stroke.strokeType === 'eraser') this.onEraseDrawing();
      if (this.stroke.strokeType === 'spray')
        this.onDrawSpray(this.dragPos.x, this.dragPos.y);
      if (
        this.stroke.strokeType !== 'highlighter' &&
        this.stroke.strokeType !== 'spray' &&
        this.stroke.strokeType !== 'eraser'
      )
        this.ctx.stroke();

      this.onSaveStrokePos();
    }
  }

  onStopDraw(): void {
    if (this.isDrawing) {
      if (this.stroke.strokeType !== 'eraser') {
        this.ctx.stroke();
        this.ctx.closePath();
      }
      this.isDrawing = false;
      this.onSaveStrokePos();
      if (this.stroke.strokeType === 'arrow')
        this.onDrawArrow(
          this.stroke.pos[this.stroke.pos.length - 5].x,
          this.stroke.pos[this.stroke.pos.length - 5].y,
          this.stroke.pos[this.stroke.pos.length - 1].x,
          this.stroke.pos[this.stroke.pos.length - 1].y
        );
      if (this.stroke.strokeType === 'eraser') this.onEraseDrawing();
      this.currStoryImg.items = [
        ...this.currStoryImg.items,
        { ...this.stroke },
      ];
      this.stroke.pos = [];
    }
  }

  onDrawArrow(fromx: number, fromy: number, tox: number, toy: number): void {
    const dx = tox - fromx;
    const dy = toy - fromy;
    const headlen = 35;
    const angle = Math.atan2(dy, dx);
    this.ctx.beginPath();
    this.ctx.moveTo(
      tox - headlen * Math.cos(angle - Math.PI / 6),
      toy - headlen * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(tox, toy);
    this.ctx.lineTo(
      tox - headlen * Math.cos(angle + Math.PI / 6),
      toy - headlen * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
  }

  onDrawSpray(x: number, y: number): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.stroke.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.stroke.color;
    for (var i = 20; i--; ) {
      this.ctx.rect(
        x + Math.random() * 20 - 10,
        y + Math.random() * 20 - 10,
        1,
        1
      );

      this.ctx.fill();
    }
    this.ctx.closePath();
  }

  onEraseDrawing(): void {
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.clearRect(
      this.dragPos.x - this.stroke.size / 2,
      this.dragPos.y - this.stroke.size / 2,
      this.stroke.size,
      this.stroke.size
    );
    this.ctx.restore();
    this.currStoryImg.items.forEach((item, idx) => {
      if (item.type === 'stroke' && item.strokeType !== 'eraser') {
        item.pos.forEach((pos: { x: number; y: number }, posIdx: number) => {
          if (
            pos.x > this.dragPos.x - this.stroke.size / 2 &&
            pos.x < this.dragPos.x + this.stroke.size / 2 &&
            pos.y > this.dragPos.y - this.stroke.size / 2 &&
            pos.y < this.dragPos.y + this.stroke.size / 2
          ) {
            item.pos.splice(posIdx, 1);
          }
          if (!item.pos.length) this.currStoryImg.items.splice(idx, 1);
        });
      }
    });
    this.setCanvas();
  }

  onSaveStrokePos(): void {
    this.stroke.pos.push({ x: this.dragPos.x, y: this.dragPos.y });
  }

  onUndoStroke(): void {
    const items = [...this.currStoryImg.items];
    let idx = items.reverse().findIndex((item) => item.type === 'stroke');
    idx = items.length - idx - 1;
    if (idx === -1) return;
    this.currStoryImg.items.splice(idx, 1);
    this.setCanvas();
  }

  onStrokeChange(obj: { key: string; value: string | number }): void {
    if (typeof obj.value === 'string') {
      if (obj.key === 'color') this.stroke.color = obj.value;
      if (obj.key === 'strokeType') this.stroke.strokeType = obj.value;
    }
    if (typeof obj.value === 'number') {
      if (obj.key === 'size') this.stroke.size = obj.value;
      if (obj.key === 'shadowBlur') this.stroke.shadowBlur = obj.value;
    }
  }

  onRemoveItem(item: any): void {
    const idx = this.currStoryImg.items.indexOf(item);
    this.currStoryImg.items.splice(idx, 1);
    this.canvas.nativeElement.style.cursor = 'default';
    this.isDeleteAreaShown = false;
    this.setCanvas();
  }

  async onShareStory(): Promise<void> {
    this.isSaving = true;
    const storyToAdd = this.storyService.getEmptyStory();
    await this.convertCanvasImgsToImgUrls(storyToAdd.imgUrls);
    storyToAdd.by = this.userService.getMiniUser(this.loggedinUser);

    const id = await this.storyService.save(storyToAdd);
    if (typeof id === 'number') {
      this.loggedinUser.storySum++;
      this.loggedinUser.currStoryId = id;
    }
    const updatedUser = await lastValueFrom(
      this.userService.update(this.loggedinUser)
    );
    if (updatedUser) this.router.navigate(['/']);
  }

  async convertCanvasImgsToImgUrls(imgUrls: string[]): Promise<void> {
    const canvas = this.offScreenCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    return new Promise<void>((resolve, reject) => {
      let completed = 0;

      this.storyImgs.forEach(async (storyImg, idx) => {
        if (!ctx) return;
        const img = new Image();
        img.src = storyImg.url;
        img.crossOrigin = 'Anonymous';

        img.onload = async () => {
          ctx.imageSmoothingQuality = 'high';
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          storyImg.items.forEach((item) => {
            if (item.type === 'txt') this.setText(item, ctx);
            if (item.type === 'stroke') this.setStroke(item, ctx);
            if (item.type === 'sticker') {
              const image = new Image();
              image.src = item.url;
              image.crossOrigin = 'Anonymous';
              image.onload = () => {
                ctx.drawImage(
                  image,
                  item.rect.x,
                  item.rect.y,
                  item.rect.width,
                  item.rect.height
                );
              };
            }
          });

          const imgData = canvas.toDataURL();
          const res = await this.uploadImgService.uploadImg(imgData);
          if (res) imgUrls[idx] = res;

          completed++;
          if (completed === this.storyImgs.length) resolve();
        };
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
