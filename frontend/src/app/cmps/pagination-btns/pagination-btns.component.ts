import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'pagination-btns',
  templateUrl: './pagination-btns.component.html',
  styleUrls: ['./pagination-btns.component.scss'],
  inputs: ['isPaginationBtnShown', 'isEditIcon'],
  outputs: ['nextItem', 'prevItem']
})
export class PaginationBtnsComponent implements OnInit {

  constructor() { };

  isPaginationBtnShown = { left: false, right: false };
  isEditIcon!: boolean;

  nextItem = new EventEmitter<number>();
  prevItem = new EventEmitter<number>();

  ngOnInit(): void { };

  onNextItem(): void {
    this.nextItem.emit(1);
  };

  onPrevItem(): void {
    this.prevItem.emit(-1);
  };
};