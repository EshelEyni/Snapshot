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
  inputs: ['loggedinUser', 'type', 'chat'],
  outputs: ['close']
})
export class ShareModalComponent implements OnInit, OnDestroy {

  constructor() { }

  userService = inject(UserService);
  chatService = inject(ChatService);
  chat!: Chat;
  faX = faX;

  loggedinUser!: User;
  users: MiniUser[] = [];
  selectedUsers: MiniUser[] = [];
  chats$: Observable<Chat[]> = this.chatService.chats$;
  chatSub!: Subscription;
  currChatMemberidsSet!: Set<number>;
  type!: string;
  close = new EventEmitter();

  async ngOnInit() {
    let isChatLoaded = false;
    this.chatSub = this.chats$.subscribe(async chats => {
      if (!chats.length && !isChatLoaded) {
        this.chatService.loadChats(this.loggedinUser.id);
        isChatLoaded = true;
      }
      else {
        let users = chats.reduce((acc, chat) => {
          const { members } = chat;
          let otherUsers = members.filter(user => user.id !== this.loggedinUser.id);

          if (this.type === 'chat-setting') {
            this.selectedUsers = [];
            this.currChatMemberidsSet = new Set(this.chat.members.map(user => user.id));
            otherUsers = otherUsers.filter(user => !this.currChatMemberidsSet.has(user.id));
          }

          return [...acc, ...otherUsers]
        }, [] as MiniUser[])

        const userIdsSet = new Set(users.map(u => u.id));
        const userIdsArr = Array.from(userIdsSet);
        users = userIdsArr.map(id => {
          const user = users.find(u => u.id === id);
          if (!user) throw new Error('user not found');
          return user;
        });

        this.users = users;
      }
    })
  }

  setTitle() {
    switch (this.type) {
      case 'message-page':
        return 'New Message';
      case 'chat-setting':
        return 'Add People';
      case 'post-preview':
        return 'Share';
      default:
        return 'Share';
    }
  }

  onAddUser(user: MiniUser) {
    this.selectedUsers = [...this.selectedUsers, user];
    console.log('selectedUsers', this.selectedUsers);
  }

  onRemoveUser(user: MiniUser) {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
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
    if (this.currChatMemberidsSet && this.currChatMemberidsSet.size) {
      this.users = users.filter(user => !this.currChatMemberidsSet.has(user.id));
    }
  }



  onCloseModal() {
    this.close.emit();
  }

  async onSend() {

    if (this.type === 'chat-setting') {

      const chatToUpdate = this.chat ;
      chatToUpdate.members = [...chatToUpdate.members, ...this.selectedUsers];
      await this.chatService.updateChat(chatToUpdate, this.loggedinUser.id);

      this.onCloseModal();
      return;

    } else {

      const chatToAdd = this.chatService.getEmptyChat(
        this.userService.getMiniUser(this.loggedinUser),
        this.selectedUsers
      );
      await this.chatService.addChat(chatToAdd)
    }

    this.onCloseModal();
  }

  ngOnDestroy() {
    this.chatSub.unsubscribe();
  }

}