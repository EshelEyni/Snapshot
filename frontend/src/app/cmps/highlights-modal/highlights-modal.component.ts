import { User } from 'src/app/models/user.model';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Story } from 'src/app/models/story.model';

@Component({
  selector: 'highlights-modal',
  templateUrl: './highlights-modal.component.html',
  styleUrls: ['./highlights-modal.component.scss'],
  inputs: ['loggedinUser'],
  outputs: ['closeModal']
})
export class HighlightsModalComponent implements OnInit {

  constructor() { }

  loggedinUser!: User;
  highlightName = 'a';
  isHighlightNameEdit: boolean = false;
  isStoryPicker: boolean = true;
  isCoverPicker: boolean = false;
  story!: Story;
  cover!: number;
  closeModal = new EventEmitter();

  ngOnInit(): void {
  }



  onAddHighlightName(name: string) {
    this.highlightName = name;
    console.log('this.highlightName', this.highlightName);
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
  }

  onSaveHighlight() {
    console.log('this.story', this.story);
    console.log('this.cover', this.cover);
    console.log('this.highlightName', this.highlightName);
  }

  onCloseModal() {
    this.closeModal.emit();
  }
}
