import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'txt-input',
  templateUrl: './txt-input.component.html',
  styleUrls: ['./txt-input.component.scss']
})
export class TxtInputComponent implements OnInit {

  constructor() { }
  txt = {
    str: '',
    style: {
      color: 'red',
      font: '30px Arial',
    }
  };

  ngOnInit(): void {
  }

  onAddTxt() {
    console.log('onAddTxt');
  }
}
