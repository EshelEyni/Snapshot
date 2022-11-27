import { Component, OnInit } from '@angular/core';
import {  faCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ellipsis',
  templateUrl: './ellipsis.component.html',
  styleUrls: ['./ellipsis.component.scss']
})
export class EllipsisComponent implements OnInit {

  constructor() { }
  faCircle = faCircle;

  ngOnInit(): void {
  }

}
