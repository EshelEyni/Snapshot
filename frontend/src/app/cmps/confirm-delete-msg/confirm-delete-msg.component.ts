import { Component, OnInit, EventEmitter, inject } from '@angular/core';

@Component({
  selector: 'confirm-delete-msg',
  templateUrl: './confirm-delete-msg.component.html',
  styleUrls: ['./confirm-delete-msg.component.scss'],
  inputs: ['entityType'],
  outputs: ['close', 'deleteEntity'],
})
export class ConfirmDeleteMsgComponent implements OnInit {

  constructor() { };

  close = new EventEmitter();
  deleteEntity = new EventEmitter();

  entityType!: string;
  titleTxt!: string;
  bodyTxt!: string;

  ngOnInit(): void {
    this.titleTxt = `Delete ${this.entityType}?`;
    this.bodyTxt = `Are you sure you want to delete this ${this.entityType}?`;
  }

  onClose() {
    this.close.emit();
  }

  onConfirmDelete() {
    this.deleteEntity.emit();
    this.close.emit();
  }

}
