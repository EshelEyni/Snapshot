import { Chat } from './../../models/chat.model';
import { ChatService } from './../../services/chat.service';
import { MiniUser } from './../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Component, EventEmitter, OnInit, Output, inject, OnDestroy } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user.model';
import { Tag } from 'src/app/models/tag.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  inputs: ['loggedinUser'],
  outputs: ['close']
})
export class ShareModalComponent implements OnInit, OnDestroy {

  constructor() { }

  userService = inject(UserService);
  chatService = inject(ChatService);
  faX = faX;

  loggedinUser!: User;
  users: MiniUser[] = [];
  usersToSend: MiniUser[] = [];
  chats$: Observable<Chat[]> = this.chatService.chats$;
  chatSub!: Subscription;
  close = new EventEmitter();

  async ngOnInit() {
    this.chatSub = this.chats$.subscribe(chats => {
      if (!chats.length) {
        this.chatService.loadChats(this.loggedinUser.id);
      }
      else {
        this.users = chats.reduce((acc, chat) => {
          const { members } = chat;
          const otherUsers = members.filter(user => user.id !== this.loggedinUser.id);
          return [...acc, ...otherUsers]
        }, [] as MiniUser[])
      }
    })
  }

  onAddUser(user: MiniUser) {
    this.usersToSend.push(user);
  }

  onRemoveUser(user: MiniUser) {
    this.usersToSend = this.usersToSend.filter(u => u.id !== user.id);
  }

  onSearchFinished(res: { searchResult: { users: User[], tags: Tag[] }, isClearSearch: boolean }
  ) {
    const { searchResult, isClearSearch } = res;
    const { users } = searchResult;

    if (isClearSearch) {
      this.users = [];
      return;
    }
    this.users = users;
  }



  onCloseModal() {
    this.close.emit();
  }

  onSend() {
    const users = [
      { isAdmin: true, ...this.userService.getMiniUser(this.loggedinUser) },
      ...this.usersToSend
    ]
    this.chatService.addChat(users)
    this.onCloseModal();
  }

  ngOnDestroy() {
    this.chatSub.unsubscribe();
  }

}