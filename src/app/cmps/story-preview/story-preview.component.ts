import { Story } from './../../models/story.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'story-preview',
  templateUrl: './story-preview.component.html',
  styleUrls: ['./story-preview.component.scss'],
  inputs: ['story','isHighlight']
})
export class StoryPreviewComponent implements OnInit {

  constructor() { }
  story!: Story;
  isHighlight!: boolean;
  
  ngOnInit(): void {
  }

}
