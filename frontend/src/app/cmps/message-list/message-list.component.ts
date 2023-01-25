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

  @ViewChild('msgList') msgList!: ElementRef<HTMLDivElement>;

  constructor() { }

  messages!: Message[];
  loggedinUser!: User;
  
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const el: HTMLDivElement = this.msgList.nativeElement;
    el.scrollTop = el.scrollHeight;
    // el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
  }
}