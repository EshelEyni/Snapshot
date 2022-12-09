import { Component, OnInit, EventEmitter } from '@angular/core';
import { CanvasStroke } from 'src/app/models/canvas.model';

@Component({
  selector: 'painter-settings',
  templateUrl: './painter-settings.component.html',
  styleUrls: ['./painter-settings.component.scss'],
  inputs: ['isPainterActive'],
  outputs: ['close', 'undo', 'strokeChange']
})
export class PainterSettingsComponent implements OnInit {

  constructor() { }

  close = new EventEmitter<string>();
  undo = new EventEmitter();
  strokeChange = new EventEmitter<CanvasStroke>();

  stroke = { size: 1, color: 'red' }
  isPainterActive!: boolean;

  ngOnInit(): void {
  }

  onUndo() {
    console.log('Undo');
    this.undo.emit();
  }

  onClose() {
    this.close.emit('painter');
  }

  onChangeStrokeSize(ev: number | null) {
    if (!ev) return;
    this.stroke.size += ev;
    this.strokeChange.emit(this.stroke);
  }

  onColorChange(color: string) {
    this.stroke.color = color;
    this.strokeChange.emit(this.stroke);
  }
}
