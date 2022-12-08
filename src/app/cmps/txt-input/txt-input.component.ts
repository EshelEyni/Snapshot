import { CanvasTxt } from './../../models/canvas.model';
import { ViewChild, ElementRef, OnChanges, EventEmitter, AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'txt-input',
  templateUrl: './txt-input.component.html',
  styleUrls: ['./txt-input.component.scss'],
  inputs: ['txtToEdit'],
  outputs: ['close', 'addTxt']
})
export class TxtInputComponent implements OnInit, AfterViewInit {

  constructor() { }
  @ViewChild('txtInput') txtInput!: ElementRef;

  close = new EventEmitter<string>();
  addTxt = new EventEmitter<{}>();

  fontSize: number = 35;
  txtToEdit!: CanvasTxt;

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


  ngOnInit(): void {
    if (this.txtToEdit) {
      this.txt = this.txtToEdit;
      this.fontSize = +this.txtToEdit.style['font-size'].slice(0, -2);
    }
  }

  ngAfterViewInit(): void {
    this.txtInput.nativeElement.focus();
  }


  onColorChange(color: string) {
    this.txt.style.color = color;
    this.txtInput.nativeElement.focus();
  }

  onChangeFontSize(ev: number | null) {
    if (!ev) return;
    this.fontSize += ev;
    this.txt.rect.height = this.fontSize;
    this.txt.style['font-size'] = this.fontSize + 'px';
    // this.txtInput.nativeElement.focus();
  }

  onFontChange(font: string) {
    this.txt.style['font-family'] = font;
    this.txtInput.nativeElement.focus();
  }

  onAddTxt() {
    if (!this.txt.str) {
      this.close.emit('txt');
      return;
    }
    this.addTxt.emit(this.txt);
  }

  onClose() {
    this.close.emit('txt');
  }

}
