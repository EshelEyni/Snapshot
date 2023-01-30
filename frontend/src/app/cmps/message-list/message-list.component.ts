import { User } from 'src/app/models/user.model';
import { Message } from 'src/app/models/chat.model';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  inputs: ['messages', 'loggedinUser']
})
export class MessageListComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor() { };

  @ViewChild('msgList') msgList!: ElementRef<HTMLDivElement>;

  messages!: Message[];
  loggedinUser!: User;

  ngOnInit(): void { };

  ngAfterViewInit(): void {
    this.scrollToBottom();
  };

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  };

  scrollToBottom(): void {
    const el: HTMLDivElement = this.msgList.nativeElement;
    el.scrollTop = el.scrollHeight;
  };
};