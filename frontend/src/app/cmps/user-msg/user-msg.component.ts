import { Subscription } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'user-msg',
  templateUrl: './user-msg.component.html',
  styleUrls: ['./user-msg.component.scss'],
})
export class UserMsgComponent implements OnInit, OnDestroy {

  constructor() { };

  communicationService = inject(CommunicationService);
  
  msg!: string | null;
  sub!: Subscription;

  ngOnInit(): void {
    this.sub = this.communicationService.userMsgEmitter.subscribe((msg) => {
      this.msg = msg;
      const timeOutId = setTimeout(() => {
        this.msg = null;
        clearTimeout(timeOutId);
      }, 3000);
    });
  };

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  };
};