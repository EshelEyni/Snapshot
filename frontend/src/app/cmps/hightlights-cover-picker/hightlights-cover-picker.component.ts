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

  constructor() { }
  coverSelected = new EventEmitter<number>();
  goBack = new EventEmitter();
  closeModal = new EventEmitter();
  story!: Story;
  isCoverImgSelected: { idx: number, isSelected: boolean }[] = [];
  currCoverImgUrl!: string;
  currCoverIdx!: number;
  faX = faX;
  faChevronLeft = faChevronLeft;


  ngOnInit(): void {
    this.isCoverImgSelected = this.story.imgUrls.map((imgUrl, idx) => {
      if (idx === 0) {
        this.currCoverImgUrl = imgUrl;
        this.currCoverIdx = idx;
        return { idx, isSelected: true }
      }
      return { idx, isSelected: false }
    })
  }

  onCoverChecked(idx: number) {
    this.isCoverImgSelected.forEach(story => story.isSelected = false);
    this.isCoverImgSelected[idx].isSelected = !this.isCoverImgSelected[idx].isSelected;
    this.currCoverImgUrl = this.story.imgUrls[idx];
    this.currCoverIdx = idx;
  }


  onCoverSelected() {
    this.coverSelected.emit(this.currCoverIdx);
  }

  onGoBack() {
    this.goBack.emit();
  }

  onCloseModal() {
    this.closeModal.emit();
  }


}
