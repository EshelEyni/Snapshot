import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  focusEmitter = new EventEmitter<void>();
  
  constructor() { }

  focusInput() {
    this.focusEmitter.emit();
  }
}
