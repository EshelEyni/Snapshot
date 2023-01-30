import { faX, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Story } from 'src/app/models/story.model';

@Component({
  selector: 'hightlights-story-picker',
  templateUrl: './hightlights-story-picker.component.html',
  styleUrls: ['./hightlights-story-picker.component.scss'],
  outputs: ['closeModal', 'goBack', 'storySelected']
})
export class HightlightsStoryPickerComponent implements OnInit {

  constructor() { };

  faX = faX;
  faChevronLeft = faChevronLeft;

  story!: Story | null;

  storySelected = new EventEmitter<Story>();
  closeModal = new EventEmitter();
  goBack = new EventEmitter();

  ngOnInit(): void { };

  onStorySelected(): void {
    if (!this.story) return;
    this.storySelected.emit(this.story);
  };

  onStoryChecked(story: Story | null): void {
    this.story = story;
  };

  onCloseModal(): void {
    this.closeModal.emit();
  };

  onGoBack(): void {
    this.goBack.emit();
  };
};