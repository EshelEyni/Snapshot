import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'story-timer',
  templateUrl: './story-timer.component.html',
  styleUrls: ['./story-timer.component.scss'],
  inputs: ['imgUrls']
})
export class StoryTimerComponent implements OnInit {

  constructor(
  ) { }
  imgUrls!: string[];

  ngOnInit(): void {

  }
}
