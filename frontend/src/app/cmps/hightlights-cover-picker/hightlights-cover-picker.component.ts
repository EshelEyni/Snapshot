import { faX, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Story } from './../../models/story.model';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'hightlights-cover-picker',
  templateUrl: './hightlights-cover-picker.component.html',
  styleUrls: ['./hightlights-cover-picker.component.scss'],
  inputs: ['story'],
  outputs: ['coverSelected', 'goBack', 'closeModal']
})
export class HightlightsCoverPickerComponent implements OnInit {

  constructor() { };
  faX = faX;
  faChevronLeft = faChevronLeft;

  story!: Story;
  currCoverImgUrl!: string;
  currCoverIdx!: number;

  isCoverImgSelected: { idx: number, isSelected: boolean }[] = [];

  coverSelected = new EventEmitter<number>();
  goBack = new EventEmitter();
  closeModal = new EventEmitter();

  ngOnInit(): void {
    this.isCoverImgSelected = this.story.imgUrls.map((imgUrl, idx) => {
      if (idx === 0) {
        this.currCoverImgUrl = imgUrl;;
        this.currCoverIdx = idx;;
        return { idx, isSelected: true };
      }
      return { idx, isSelected: false };
    });
  };

  onCoverChecked(idx: number): void {
    this.isCoverImgSelected.forEach(story => story.isSelected = false);
    this.isCoverImgSelected[idx].isSelected = !this.isCoverImgSelected[idx].isSelected;
    this.currCoverImgUrl = this.story.imgUrls[idx];
    this.currCoverIdx = idx;
  };

  onCoverSelected(): void {
    this.coverSelected.emit(this.currCoverIdx);
  };

  onGoBack(): void {
    this.goBack.emit();
  };

  onCloseModal(): void {
    this.closeModal.emit();
  };
};