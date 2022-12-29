import { Story, StoryImg } from './../../models/story.model';
import { Router } from '@angular/router';
import { Component, OnInit, inject, OnChanges, OnDestroy, EventEmitter } from '@angular/core';

@Component({
  selector: 'story-timer',
  templateUrl: './story-timer.component.html',
  styleUrls: ['./story-timer.component.scss'],
  inputs: ['currStory', 'nextStory', 'currImgIdx'],
  outputs: ['onSetImgUrl']
})
export class StoryTimerComponent implements OnInit, OnDestroy, OnChanges {


  constructor() { }
  route = inject(Router);
  onSetImgUrl = new EventEmitter<number>();
  imgUrls!: string[];
  values!: number[];
  intervalId!: any;
  currImgIdx!: number;
  idx = 0;
  currStory!: Story;
  nextStory!: Story;
  isPlaying: boolean = false;

  ngOnInit(): void {
    // this.imgUrls = this.currStory.imgUrls;
    // this.values = this.imgUrls.map(imgUrl => 0);
    // this.idx = 0;
    // clearInterval(this.intervalId);
    // if (this.isPlaying) this.playStory();
  }

  ngOnChanges() {
    this.imgUrls = this.currStory.imgUrls;
    this.values = this.imgUrls.map((imgUrl, idx) => {
      if (idx < this.currImgIdx) return 100;
      return 0
    });
    this.idx = this.currImgIdx;
    clearInterval(this.intervalId);
    if (this.isPlaying) this.playStory();
  }

  onTogglePlayStory() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) this.playStory();
    else clearInterval(this.intervalId);

  }

  playStory() {
    this.intervalId = setInterval(() => {
      // console.log('this.values[this.idx]', this.values[this.idx]);
      this.values[this.idx] = this.values[this.idx] + 2.5;
      if (this.values[this.idx] === 100) {
        this.idx = this.idx + 1;
        if (this.idx < this.values.length) this.onSetImgUrl.emit(1);
      }
      if (this.idx > this.values.length - 1) {
        clearInterval(this.intervalId);
        if (this.nextStory) this.route.navigate(['/story/', this.nextStory.id]);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    clearInterval(this.intervalId);
  }

}
