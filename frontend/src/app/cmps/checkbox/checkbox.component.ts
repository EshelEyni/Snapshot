import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  inputs: ['isChecked'],
})
export class CheckboxComponent implements OnInit {

  constructor() { }

  isChecked!: boolean;

  ngOnInit(): void {
  }

}
