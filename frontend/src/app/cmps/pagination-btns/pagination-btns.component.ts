import { Component, OnInit, EventEmitter } from '@angular/core';
import { faCircleChevronLeft, faCircleChevronRight, } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pagination-btns',
  templateUrl: './pagination-btns.component.html',
  styleUrls: ['./pagination-btns.component.scss'],
  inputs: ['isPaginationBtnShown', 'isEditIcon'],
  outputs: ['nextItem', 'prevItem']
})
export class PaginationBtnsComponent implements OnInit {

  constructor() { }

  // Icons
  faCircleChevronLeft = faCircleChevronLeft;
  faCircleChevronRight = faCircleChevronRight;


  isPaginationBtnShown = { left: false, right: false };
  isEditIcon!: boolean;
  nextItem = new EventEmitter<number>();
  prevItem = new EventEmitter<number>();

  ngOnInit(): void {
  }

  onNextItem() {
    this.nextItem.emit(1);
  }

  onPrevItem() {
    this.prevItem.emit(-1);
  }
}
