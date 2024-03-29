import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  focusEmitter = new EventEmitter<void>();
  userMsgEmitter = new EventEmitter<string>();

  constructor() { };

  focusInput(): void {
    this.focusEmitter.emit();
  };

  setUserMsg(msg: string): void {
    this.userMsgEmitter.emit(msg);
  };
};