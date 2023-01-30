import { Component, OnInit, EventEmitter } from '@angular/core';
import { } from '@fortawesome/free-regular-svg-icons';
import { faSprayCan, faEraser, faMagicWandSparkles, faHighlighter, faArrowUp, faMarker, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { StrokeType } from 'src/app/models/canvas.model';

@Component({
  selector: 'stroke-type-picker',
  templateUrl: './stroke-type-picker.component.html',
  styleUrls: ['./stroke-type-picker.component.scss'],
  outputs: ['strokeTypeChange']
})
export class StrokeTypePickerComponent implements OnInit {

  constructor() { }

  faSprayCan = faSprayCan;
  faEraser = faEraser;
  faMagicWandSparkles = faMagicWandSparkles;
  faHighlighter = faHighlighter;
  faArrowUp = faArrowUp;
  faMarker = faMarker;

  strokeTypes: { icon: IconDefinition, type: string, isSelected: boolean }[] = [
    { icon: faSprayCan, type: 'spray', isSelected: false },
    { icon: faEraser, type: 'eraser', isSelected: false },
    { icon: faMagicWandSparkles, type: 'magic-wand', isSelected: false },
    { icon: faHighlighter, type: 'highlighter', isSelected: false },
    { icon: faArrowUp, type: 'arrow', isSelected: false },
    { icon: faMarker, type: 'pen', isSelected: true },
  ];

  strokeTypeChange = new EventEmitter<string>();

  ngOnInit(): void { };

  onStrokeTypeChange(strokeType: StrokeType): void {
    this.strokeTypes.forEach(t => t.isSelected = false);
    strokeType.isSelected = true;
    this.strokeTypeChange.emit(strokeType.type);
  };
};