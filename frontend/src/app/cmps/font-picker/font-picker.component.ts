import { Component, OnInit, EventEmitter } from '@angular/core';
import { FontType } from 'src/app/models/canvas.model';

@Component({
  selector: 'font-picker',
  templateUrl: './font-picker.component.html',
  styleUrls: ['./font-picker.component.scss'],
  outputs: ['fontChange']
})
export class FontPickerComponent implements OnInit {

  constructor() { }

  fontChange = new EventEmitter<string>();

  fonts = [
    { value: 'roboto', isSelected: true },
    { value: 'roboto-bold', isSelected: false },
    { value: 'pacifico', isSelected: false },
    { value: 'cabin', isSelected: false },
    { value: 'libre-barcode', isSelected: false },
    { value: 'monoton', isSelected: false },
    { value: 'special-elite', isSelected: false },
    { value: 'titan-one', isSelected: false },
  ]

  ngOnInit(): void {
  }

  onFontChange(font: FontType) {
    this.fonts.forEach(font => font.isSelected = false);
    font.isSelected = true;
    this.fontChange.emit(font.value);
  }
}
