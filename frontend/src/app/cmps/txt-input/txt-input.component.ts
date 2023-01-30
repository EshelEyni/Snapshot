import { CanvasTxt } from './../../models/canvas.model';
import { ViewChild, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'txt-input',
  templateUrl: './txt-input.component.html',
  styleUrls: ['./txt-input.component.scss'],
  inputs: ['txtToEdit'],
  outputs: ['close', 'addTxt']
})
export class TxtInputComponent implements OnInit, AfterViewInit {

  constructor() { };
  @ViewChild('txtInput') txtInput!: ElementRef;

  txtToEdit!: CanvasTxt;
  fontSize: number = 35;

  txt = {
    str: '',
    style: {
      color: '#FFFFFF',
      'font-size': this.fontSize + 'px',
      'font-family': 'Arial'
    },
    rect: { x: 200, y: 700, height: this.fontSize, width: 0 },
    type: 'txt',
    isDragging: false
  };

  close = new EventEmitter<string>();
  addTxt = new EventEmitter<{}>();

  ngOnInit(): void {
    if (this.txtToEdit) {
      this.txt = this.txtToEdit;
      this.fontSize = +this.txtToEdit.style['font-size'].slice(0, -2);
    };
  };

  ngAfterViewInit(): void {
    this.txtInput.nativeElement.focus();
  };

  onColorChange(color: string): void {
    this.txt.style.color = color;
    this.txtInput.nativeElement.focus();
  };

  onChangeFontSize(ev: number | null): void {
    if (!ev) return;
    this.fontSize += ev;
    this.txt.rect.height = this.fontSize;
    this.txt.style['font-size'] = this.fontSize + 'px';
  };

  onFontChange(font: string): void {
    this.txt.style['font-family'] = font;
    this.txtInput.nativeElement.focus();
  };

  onAddTxt(): void {
    if (!this.txt.str) {
      this.close.emit('txt');
      return;
    };
    this.addTxt.emit(this.txt);
  };

  onClose(): void {
    this.close.emit('txt');
  };
};