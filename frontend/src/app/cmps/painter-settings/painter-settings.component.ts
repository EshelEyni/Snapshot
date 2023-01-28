import { Component, OnInit, EventEmitter } from '@angular/core';
import { CanvasStroke, StrokeType } from 'src/app/models/canvas.model';

@Component({
  selector: 'painter-settings',
  templateUrl: './painter-settings.component.html',
  styleUrls: ['./painter-settings.component.scss'],
  inputs: ['isDrawing'],
  outputs: ['close', 'undo', 'strokeChange']
})
export class PainterSettingsComponent implements OnInit {

  constructor() { }

  close = new EventEmitter<string>();
  undo = new EventEmitter();
  strokeChange = new EventEmitter<{ key: string, value: string | number }>();

  strokeSize = 1;
  isDrawing!: boolean;
  color = 'rgb(255, 255, 255)';
  strokeType = 'pen';
  shadowBlur = 0;
  inputMax = 30;
  inputMin = 1;
  stepSize = 1;

  ngOnInit(): void {
  }

  onUndo() {
    this.undo.emit();
  }

  onClose() {
    this.close.emit('painter');
  }

  onChangeStrokeSize(ev: number | null) {
    if (!ev) return;
    this.strokeSize += ev;
    this.strokeChange.emit({ key: 'size', value: this.strokeSize });
  }

  onColorChange(color: string) {
    this.color = color;
    if (this.strokeType === 'highlighter') this.onChangeColorOpacity();
    this.strokeChange.emit({ key: 'color', value: this.color });
  }

  onTypeChange(type: string) {
    this.strokeType = type;
    if (type === 'arrow') {
      this.inputMax = 5;
      if (this.strokeSize > 5) {
        this.strokeSize = 5;
        this.strokeChange.emit({ key: 'size', value: this.strokeSize });
      }
    }
    else if (type === 'eraser') {
      this.strokeSize = 15;
      this.inputMin = 15;

      this.strokeChange.emit({ key: 'size', value: this.strokeSize });
    }
    else {
      this.inputMax = 30;
      this.inputMin = 1;
      this.strokeSize = 1;
      this.strokeChange.emit({ key: 'size', value: this.strokeSize });
    }

    this.onChangeColorOpacity();
    this.onChangeShadowBlur();
    this.strokeChange.emit({ key: 'strokeType', value: type });
  }

  onChangeColorOpacity() {
    if (this.strokeType === 'highlighter') {
      const opacity = 0.5;
      const color = this.color.split(',');
      const newColor = `rgba(${color[0].split('(')[1]},${color[1]},${color[2].split(')')[0]},${opacity})`;
      this.color = newColor;
      console.log('color', this.color);
      this.strokeChange.emit({ key: 'color', value: this.color });
    } else {
      const color = this.color.split(',');
      const newColor = `rgb(${color[0].split('(')[1]},${color[1]},${color[2].split(')')[0]})`;
      this.color = newColor;
      console.log('color', this.color);
      this.strokeChange.emit({ key: 'color', value: this.color });
    }
  }

  onChangeShadowBlur() {
    this.shadowBlur = this.strokeType === 'magic-wand' ? 30 : 0;
    this.strokeChange.emit({ key: 'shadowBlur', value: this.shadowBlur });
  }
}
