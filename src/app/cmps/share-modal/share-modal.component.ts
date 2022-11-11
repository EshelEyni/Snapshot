import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss']
})
export class ShareModalComponent implements OnInit {
  constructor() { }

  faX = faX;

  usersToSend: User[] = [];
  @Output() close = new EventEmitter();

  ngOnInit(): void {
  }

  onCloseModal() {
    this.close.emit();
    console.log('onCloseModal');
  }
}