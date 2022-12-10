import { Component, OnInit, EventEmitter } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { CanvasSticker } from 'src/app/models/canvas.model';

@Component({
  selector: 'sticker-picker',
  templateUrl: './sticker-picker.component.html',
  styleUrls: ['./sticker-picker.component.scss'],
  outputs: ['close', 'addSticker'],
})
export class StickerPickerComponent implements OnInit {
  constructor() { }

  close = new EventEmitter<string>();
  addSticker = new EventEmitter();
  faX = faX;

  stickers = [
    { name: 'angel-wings', url: '../../../assets/stickers/angel-wings.png' },
    { name: 'banana-eyed-wide', url: '../../../assets/stickers/banana-eyed-wide.png' },
    { name: 'beard-1', url: '../../../assets/stickers/beard-1.png' },
    { name: 'bunny-ears', url: '../../../assets/stickers/bunny-ears.png' },
    { name: 'chicken-thumb-up', url: '../../../assets/stickers/chicken-thumb-up.png' },
    { name: 'i-stand-with-ukraine', url: '../../../assets/stickers/i-stand-with-ukraine.png' },
    { name: 'lamborghini', url: '../../../assets/stickers/lamborghini.png' },
    { name: 'lion-drawing', url: '../../../assets/stickers/lion-drawing.png' },
    { name: 'lion-hippie', url: '../../../assets/stickers/lion-hippie.png' },
    { name: 'mustache', url: '../../../assets/stickers/mustache.png' },
    { name: 'parental-adivsory', url: '../../../assets/stickers/parental-adivsory.png' },
    { name: 'peace-sign-1', url: '../../../assets/stickers/peace-sign-1.png' },
    { name: 'pigeon', url: '../../../assets/stickers/pigeon.png' },
    { name: 'pizza-1', url: '../../../assets/stickers/pizza-1.png' },
    { name: 'purple-heart', url: '../../../assets/stickers/purple-heart.png' },
    { name: 'rottweiler-drawing', url: '../../../assets/stickers/rottweiler-drawing.png' },
    { name: 'sorting-hat', url: '../../../assets/stickers/sorting-hat.png' },
    { name: 'spider-man', url: '../../../assets/stickers/spider-man.png' },
    { name: 'star-of-david', url: '../../../assets/stickers/star-of-david.png' },
    { name: 'sun-circle', url: '../../../assets/stickers/sun-circle.png' },
    { name: 'superman-symbol', url: '../../../assets/stickers/superman-symbol.png' },
    { name: 'tiger-drawing-1', url: '../../../assets/stickers/tiger-drawing-1.png' },
    { name: 'tiger-drawing-2', url: '../../../assets/stickers/tiger-drawing-2.png' },
    { name: 'tupac', url: '../../../assets/stickers/tupac.png' },
  ]
  stickersForDisplay: { name: string, url: string }[] = []

  ngOnInit(): void {
    const randomIdx = Math.floor(Math.random() * this.stickers.length);
    for (let i = 0; i < 12; i++) {
      this.stickersForDisplay.push(this.stickers[(randomIdx + i) % this.stickers.length]);
    }

  }

  onClose() {
    this.close.emit('sticker');
  }

  setCanvasSticker(sticker: { name: string, url: string }) {
    const rect = { x: 50, y: 20, width: 150, height: 150 }
    const img = new Image();
    img.src = sticker.url;
    img.onload = () => {
      const imgRatio = img.width / img.height;
      rect.height = rect.width / imgRatio;

    }
    const s = { ...sticker, rect, type: 'sticker' }
    return s as unknown as CanvasSticker;
  }

  onAddSticker(sticker: { name: string, url: string }) {
    const s = this.setCanvasSticker(sticker);
    this.addSticker.emit(s);
  }

}
