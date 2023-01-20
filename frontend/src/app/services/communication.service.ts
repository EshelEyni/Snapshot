import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  focusEmitter = new EventEmitter<void>();
  userMsgEmitter = new EventEmitter<string | null>();

  constructor() { }

  focusInput() {
    this.focusEmitter.emit();
  }

  setUserMsg(msg: string) {
    this.userMsgEmitter.emit(msg);
  }
}
