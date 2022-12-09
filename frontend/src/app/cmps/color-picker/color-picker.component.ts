import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  outputs: ['colorChange']
})
export class ColorPickerComponent implements OnInit {

  constructor() { }
  colorChange = new EventEmitter<string>();

  ngOnInit(): void {
  }

  colors = [
    { color: '#FDCB5C', isSelected: false, borderType: 'black' },
    { color: '#FD8D32', isSelected: false, borderType: 'black' },
    { color: '#D10869', isSelected: false, borderType: 'black' },
    { color: '#A307BA', isSelected: false, borderType: 'black' },
    { color: '#0095F6', isSelected: false, borderType: 'black' },
    { color: '#58C322', isSelected: false, borderType: 'black' },
    { color: '#000000', isSelected: false, borderType: 'white' },
    { color: '#FFFFFF', isSelected: true, borderType: 'black' },
  ]

  onSetColor(color: string) {
    this.colors.forEach(color => color.isSelected = false);
    this.colors.find(c => c.color === color)!.isSelected = true;
    this.colorChange.emit(color);
  }
}
