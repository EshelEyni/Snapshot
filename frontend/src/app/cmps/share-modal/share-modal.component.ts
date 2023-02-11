import { Post } from './../../models/post.model';
import { MessageService } from './../../services/message.service';
import { Chat } from './../../models/chat.model';
import { ChatService } from './../../services/chat.service';
import { MiniUser } from './../../models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Component, EventEmitter, OnInit, inject, OnDestroy } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user.model';
import { Tag } from 'src/app/models/tag.model';
import { Observable, Subscription } from 'rxjs';
import { Story } from 'src/app/models/story.model';

@Component({
  selector: 'share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  inputs: ['loggedinUser', 'type', 'chat', 'post', 'story'],
  outputs: ['close']
})
export class ShareModalComponent implements OnInit, OnDestroy {

  constructor() { }

  userService = inject(UserService);
  chatService = inject(ChatService);
  mesageService = inject(MessageService);

  type!: 'post' | 'story-reply' | 'chat-setting' | 'message-page';

  faX = faX;

  chatSub!: Subscription;
  chats$: Observable<Chat[]> = this.chatService.chats$;

  loggedinUser!: User;
  users: MiniUser[] = [];
  selectedUsers: MiniUser[] = [];

  selectedChats: Chat[] = [];
  chat!: Chat;
  currChatMemberidsSet!: Set<number>;

  post!: Post;
  story!: Story;

  isChatListShown: boolean = false;

  close = new EventEmitter();

  async ngOnInit(): Promise<void> {
    this.isChatListShown = this.type === 'post' || this.type === 'story-reply';

    this.chatService.loadChats();

    this.chatSub = this.chats$.subscribe(async chats => {

      let users = chats.reduce((acc, chat) => {
        const { members } = chat;
        let otherUsers = members.filter(u => u.id !== this.loggedinUser.id);

        if (this.type === 'chat-setting') {
          this.selectedUsers = [];
          this.currChatMemberidsSet = new Set(this.chat.members.map(u => u.id));
          otherUsers = otherUsers.filter(u => !this.currChatMemberidsSet.has(u.id));
        };

        return [...acc, ...otherUsers];
      }, [] as MiniUser[]);

      const userIdsSet = new Set(users.map(u => u.id));
      const userIdsArr = Array.from(userIdsSet);
      users = userIdsArr.map(id => {
        const user = users.find(u => u.id === id);
        if (!user) throw new Error('user not found');
        return user;
      });

      this.isChatListShown = chats.length > 0;

    });
  };

  setTitle(): string {
    switch (this.type) {
      case 'message-page':
        return 'New Message';
      case 'chat-setting':
        return 'Add People';
      case 'post':
        return 'Share';
      default:
        return 'Share';
    };
  };

  setBtnSendTitle(): string {
    switch (this.type) {
      case 'message-page':
        return 'Send';
      case 'chat-setting':
        return 'Add';
      case 'post':
        if (this.selectedUsers.length > 1 || this.selectedChats.length > 1) {
          return 'send separately';
        } else {
          return 'Send';
        }
      case 'story-reply':
        if (this.selectedUsers.length > 1 || this.selectedChats.length > 1) {
          return 'send separately';
        } else {
          return 'Send';
        }
      default:
        return 'Share';
    };
  };

  onAddChat(chat: Chat): void {
    this.selectedChats = [...this.selectedChats, chat];
  };

  onRemoveChat(chat: Chat): void {
    this.selectedChats = this.selectedChats.filter(c => c.id !== chat.id);
  };

  onAddUser(user: MiniUser): void {
    this.selectedUsers = [...this.selectedUsers, user];
  };

  onRemoveUser(user: MiniUser): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
  };

  onSearchFinished(res: { searchResult: { users: User[], tags: Tag[] }, isClearSearch: boolean }): void {
    const { searchResult, isClearSearch } = res;
    const { users } = searchResult;

    if (isClearSearch) {
      this.users = [];
      return;
    };

    this.users = users;
    if (this.currChatMemberidsSet && this.currChatMemberidsSet.size) {
      this.users = users.filter(user => !this.currChatMemberidsSet.has(user.id));
    };
    this.isChatListShown = this.users.length === 0;
  };

  onCloseModal(): void {
    this.close.emit();
  };

  async onSend(): Promise<void> {
    switch (this.type) {
      case 'message-page':
        const chatToAdd = this.chatService.getEmptyChat(
          this.userService.getMiniUser(this.loggedinUser),
          this.selectedUsers
        );
        await this.chatService.addChat(chatToAdd);
        break;
      case 'chat-setting':
        const chatToUpdate = this.chat;
        chatToUpdate.members = [...chatToUpdate.members, ...this.selectedUsers];
        await this.chatService.updateChat(chatToUpdate, this.loggedinUser.id);
        break;
      case 'post':
        const { selectedUsers, selectedChats } = this;
        if (selectedUsers.length) {
          const userPrms = selectedUsers.map(async user => {
            const chatToAdd = this.chatService.getEmptyChat(
              this.userService.getMiniUser(this.loggedinUser),
              [user]
            );
            const chatId = await this.chatService.addChat(chatToAdd)
            if (chatId) await this._setPostMessage(chatId);
          });

          await Promise.all(userPrms);
        };
        if (selectedChats.length) {
          const chatPrms = selectedChats.map(async chat => {
            await this._setPostMessage(chat.id);
          });

          await Promise.all(chatPrms);
        };
        break;
      case 'story-reply':
        const { selectedUsers: users, selectedChats: chats } = this;
        if (users.length) {
          const userPrms = users.map(async user => {
            const chatToAdd = this.chatService.getEmptyChat(
              this.userService.getMiniUser(this.loggedinUser),
              [user]
            );
            const chatId = await this.chatService.addChat(chatToAdd)
            if (chatId) await this._setStoryReplyMessage(chatId);
          });
          await Promise.all(userPrms);
        };
        if (chats.length) {
          const chatPrms = chats.map(async chat => {
            await this._setStoryReplyMessage(chat.id);
          });
          await Promise.all(chatPrms);
        };
        break;
    };

    this.onCloseModal();
  };

  private async _setPostMessage(chatId: number): Promise<void> {
    const msg = this.mesageService.getEmptyMessage();
    msg.sender = this.userService.getMiniUser(this.loggedinUser);
    msg.chatId = chatId;
    msg.type = 'post';
    msg.postId = this.post.id;
    await this.mesageService.addMessage(msg);
  };

  private async _setStoryReplyMessage(chatId: number): Promise<void> {
    const msg = this.mesageService.getEmptyMessage();
    msg.sender = this.userService.getMiniUser(this.loggedinUser);
    msg.chatId = chatId;
    msg.type = 'story';
    msg.storyId = this.story.id;
    await this.mesageService.addMessage(msg);
  };

  ngOnDestroy(): void {
    this.chatSub.unsubscribe();
  };
};