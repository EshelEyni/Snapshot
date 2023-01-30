import { Story } from './../../models/story.model';
import { Router } from '@angular/router';
import { Component, OnInit, inject, OnChanges, OnDestroy, EventEmitter } from '@angular/core';

@Component({
  selector: 'story-timer',
  templateUrl: './story-timer.component.html',
  styleUrls: ['./story-timer.component.scss'],
  inputs: ['currStory', 'nextStory', 'currImgIdx', 'isPlaying', 'isUserStory'],
  outputs: ['onSetImgUrl']
})
export class StoryTimerComponent implements OnInit, OnDestroy, OnChanges {


  constructor() { }

  router = inject(Router);

  imgUrls!: string[];
  values!: number[];

  intervalId!: any;
  currStory!: Story;
  nextStory!: Story;
  currImgIdx!: number;
  idx = 0;

  userPreviewType: 'story-timer' | 'user-story-timer' = 'story-timer';

  isPlaying!: boolean;
  isUserStory!: boolean;

  onSetImgUrl = new EventEmitter<number>();

  ngOnInit(): void { };

  ngOnChanges(): void {
    this.userPreviewType = this.isUserStory ? 'user-story-timer' : 'story-timer';
    this.imgUrls = this.currStory.imgUrls;
    this.values = this.imgUrls.map((url, idx) => {
      if (idx < this.currImgIdx) return 100;
      return 0;
    });
    this.idx = this.currImgIdx;
    clearInterval(this.intervalId);
    if (this.isPlaying) this.playStory();
  };

  onTogglePlayStory(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) this.playStory();
    else clearInterval(this.intervalId);
  };

  playStory(): void {
    this.intervalId = setInterval(() => {
      this.values[this.idx] = this.values[this.idx] + 2.5;

      if (this.values[this.idx] === 100) {
        this.idx = this.idx + 1;
        if (this.idx < this.values.length) this.onSetImgUrl.emit(1);
      };

      if (this.idx > this.values.length - 1) {
        clearInterval(this.intervalId);
        if (this.nextStory) this.router.navigate(['/story/', this.nextStory.id]);
      };
    }, 100);
  };

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  };
};