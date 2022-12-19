import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-msg',
  templateUrl: './user-msg.component.html',
  styleUrls: ['./user-msg.component.scss'],
  inputs: ['msg'],
})
export class UserMsgComponent implements OnInit {

  constructor() { }

  msg!: string;

  ngOnInit(): void {
  }

}
