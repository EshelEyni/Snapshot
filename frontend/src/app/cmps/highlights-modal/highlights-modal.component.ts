import { StoryService } from './../../services/story.service';
import { User } from 'src/app/models/user.model';
import { Component, OnInit, EventEmitter, inject } from '@angular/core';
import { Story } from 'src/app/models/story.model';

@Component({
  selector: 'highlights-modal',
  templateUrl: './highlights-modal.component.html',
  styleUrls: ['./highlights-modal.component.scss'],
  inputs: ['loggedinUser'],
  outputs: ['close']
})
export class HighlightsModalComponent implements OnInit {

  constructor() { }
  close = new EventEmitter();

  storyService = inject(StoryService);
  loggedinUser!: User;
  highlightName = '';
  isHighlightNameEdit: boolean = true;
  isStoryPicker: boolean = false;
  isCoverPicker: boolean = false;
  story!: Story;
  cover!: number;

  ngOnInit(): void {
  }

  onAddHighlightName(name: string) {
    this.highlightName = name;
    this.isHighlightNameEdit = false;
    this.isStoryPicker = true;
  }

  onGoBack() {
    if (this.isCoverPicker) {
      this.isCoverPicker = false;
      this.isStoryPicker = true;
    }
    else if (this.isStoryPicker) {
      this.isStoryPicker = false;
      this.isHighlightNameEdit = true;
    }
  }

  onStorySelected(story: Story) {
    this.story = story;
    this.isStoryPicker = false;
    this.isCoverPicker = true;
  }

  onCoverSelected(cover: number) {
    this.cover = cover;
    this.onSaveHighlight();
  }
  
  onSaveHighlight() {
    const story = {...this.story};
    story.isSaved = true;
    story.highlightTitle = this.highlightName;
    story.highlightCover = this.cover;
    
    this.storyService.save(story);
    this.onCloseModal();
  }

  onCloseModal() {
    this.close.emit();
  }
}
