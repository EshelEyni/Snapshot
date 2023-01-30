import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'comment-options-modal',
  templateUrl: './comment-options-modal.component.html',
  styleUrls: ['./comment-options-modal.component.scss'],
  outputs: ['remove', 'close']
})
export class CommentOptionsModalComponent implements OnInit {

  constructor() { }

  remove = new EventEmitter();
  close = new EventEmitter();

  ngOnInit(): void { };

  onRemove(): void {
    this.remove.emit();
  };

  onClose(): void {
    this.close.emit();
  };
};