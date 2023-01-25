import { User } from 'src/app/models/user.model';
import { Message } from 'src/app/models/chat.model';
import { Component, OnInit } from '@angular/core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  inputs: ['message', 'loggedinUser']
})
export class MessageComponent implements OnInit {

  constructor() { }

  message!: Message;
  loggedinUser!: User;
  isSenderLoggedinUser = false;
  faHeart = faHeart;
  ngOnInit(): void {
    this.isSenderLoggedinUser = this.message.sender.id === this.loggedinUser.id
  }

}
