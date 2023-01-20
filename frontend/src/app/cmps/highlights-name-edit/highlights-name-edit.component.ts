import { faX } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'highlights-name-edit',
  templateUrl: './highlights-name-edit.component.html',
  styleUrls: ['./highlights-name-edit.component.scss'],
  inputs: ['highlightName'],
  outputs: ['closeModal', 'addHightlightName']
})
export class HighlightsNameEditComponent implements OnInit {

  constructor() { }

  faX = faX;
  closeModal = new EventEmitter();
  addHightlightName = new EventEmitter<string>();
  highlightName: string = '';

  ngOnInit(): void {
  }


  onAddHighlightName() {
    this.addHightlightName.emit(this.highlightName);
  }

  onCloseModal() {
    this.closeModal.emit();
  }

}
