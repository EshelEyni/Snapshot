import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'zoom-modal',
  templateUrl: './zoom-modal.component.html',
  styleUrls: ['./zoom-modal.component.scss'],
  inputs: ['value'],
  outputs: ['zoomSelected']
})
export class ZoomModalComponent implements OnInit {

  constructor() { }

  zoomSelected = new EventEmitter<number>();
  value!: number;

  ngOnInit(): void {
  }

  onSetZoom(zoom: number | null) {
    if (zoom === null) return;
    this.zoomSelected.emit(zoom);
  }

}
