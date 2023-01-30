import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  outputs: ['colorChange']
})
export class ColorPickerComponent implements OnInit {
  
  constructor() { };
  
  colorChange = new EventEmitter<string>();

  ngOnInit(): void { };

  colors: { color: string, isSelected: boolean, borderType: 'black' | 'white' }[] = [
    { color: 'rgb(253, 203, 92)', isSelected: false, borderType: 'black' },
    { color: 'rgb(253, 141, 50)', isSelected: false, borderType: 'black' },
    { color: 'rgb(209, 8, 105)', isSelected: false, borderType: 'black' },
    { color: 'rgb(163, 7, 186)', isSelected: false, borderType: 'black' },
    { color: 'rgb(0, 149, 246)', isSelected: false, borderType: 'black' },
    { color: 'rgb(88, 195, 34)', isSelected: false, borderType: 'black' },
    { color: 'rgb(0, 0, 0)', isSelected: false, borderType: 'white' },
    { color: 'rgb(255, 255, 255)', isSelected: true, borderType: 'black' },
  ];

  onSetColor(color: string): void {
    this.colors.forEach(color => color.isSelected = false);
    this.colors.find(c => c.color === color)!.isSelected = true;
    this.colorChange.emit(color);
  };
};