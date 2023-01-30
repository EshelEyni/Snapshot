import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  inputs: ['isChecked', 'type'],
})
export class CheckboxComponent implements OnInit {

  constructor() { }

  isChecked!: boolean;
  type!: string;

  ngOnInit(): void { };

};