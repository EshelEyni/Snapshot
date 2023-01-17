import { Component, OnInit } from '@angular/core';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pagination-btn-prev',
  templateUrl: './pagination-btn-prev.component.html',
  styleUrls: ['./pagination-btn-prev.component.scss'],
  inputs: ['isEditIcon'],
})
export class PaginationBtnPrevComponent implements OnInit {

  constructor() { }
  isEditIcon!: boolean;
  faCircleChevronLeft = faCircleChevronLeft;

  ngOnInit(): void {
  }

}
