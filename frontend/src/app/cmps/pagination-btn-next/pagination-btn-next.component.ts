import { Component, OnInit } from '@angular/core';
import { faCircleChevronRight, } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pagination-btn-next',
  templateUrl: './pagination-btn-next.component.html',
  styleUrls: ['./pagination-btn-next.component.scss'],
  inputs: ['isEditIcon']
})
export class PaginationBtnNextComponent implements OnInit {

  constructor() { }
  faCircleChevronRight = faCircleChevronRight;
  isEditIcon!: boolean;

  ngOnInit(): void { };

};