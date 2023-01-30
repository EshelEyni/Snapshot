import { Chat } from './../../models/chat.model';
import { Observable, Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from './../../store/store';
import { MiniUser } from './../../models/user.model';
import { Component, OnInit, OnChanges, EventEmitter, SimpleChanges, OnDestroy, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  inputs: ['users', 'selectedUsers', 'type', 'chat'],
  outputs: ['addUser', 'removeUser']
})
export class UserListComponent implements OnInit, OnChanges, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }

  store = inject(Store<State>);

  type!: 'like-modal' | 'home-page-suggestion-list' | 'discover-people-list' | 'following-list'
    | 'followers-list' | 'share-modal' | 'chat-setting' | 'search-bar-list';
  title: string = '';

  sub: Subscription | null = null;

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;

  users!: MiniUser[];
  selectedUsers!: MiniUser[];
  isSelectUser: { idx: number, isSelected: boolean }[] = [];

  chat!: Chat;
  currUser!: MiniUser; // for chat options modal

  isLoggedinUserAdmin: boolean = false;
  isTitle: boolean = true;
  isFollowBtnShow: boolean = false;
  isShareModalShown: boolean = false;
  isChatOptionsModalShown: boolean = false;
  isMainScreenShown: boolean = false;

  addUser = new EventEmitter<MiniUser>();
  removeUser = new EventEmitter<MiniUser>();

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user }
      };
    });
    this.setTitle();

    this.isFollowBtnShow = this.type === 'like-modal'
      || this.type === 'home-page-suggestion-list'
      || this.type === 'discover-people-list'
      || this.type === 'following-list'
      || this.type === 'followers-list';

    if (this.type === 'chat-setting') {
      this.isLoggedinUserAdmin = this.chat.admins.some(a => a.id === this.loggedinUser.id);
    };
  };

  ngOnChanges(changes: SimpleChanges): void {

    if (this.type === 'share-modal') {
      this.setIsSelectUser();
    };

    if (changes['selectedUsers']) {
      this.selectedUsers = this.selectedUsers;
    };
  };

  setIsSelectUser() {
    this.isSelectUser = this.users.map((user, idx) => {
      const isUserSelected = this.selectedUsers.some((userToSend) => userToSend.id === user.id);
      return { idx, isSelected: isUserSelected };
    });
  };

  onToggleSelectUser(idx: number): void {
    if (this.type !== 'share-modal') return;
    this.isSelectUser[idx].isSelected = !this.isSelectUser[idx].isSelected;
    if (this.isSelectUser[idx].isSelected) {
      this.addUser.emit(this.users[idx]);
    } else {
      this.removeUser.emit(this.users[idx]);
    };
  };

  onToggleModal(el: string, user?: MiniUser): void {
    switch (el) {
      case 'share-modal':
        this.isShareModalShown = !this.isShareModalShown;
        break;
      case 'chat-options-modal':
        this.currUser = user!;
        this.isChatOptionsModalShown = !this.isChatOptionsModalShown;
        break;
      case 'main-screen':
        if (this.isChatOptionsModalShown) this.isChatOptionsModalShown = false;
        if (this.isShareModalShown) this.isShareModalShown = false;
        break;
    };

    this.isMainScreenShown = !this.isMainScreenShown;
  };

  onRemoveUser(idx: number): void {
    this.removeUser.emit(this.users[idx]);
  };

  onAddChatMembers(chatMembers: MiniUser[]): void {
    this.users = [...this.users, ...chatMembers];
  };

  setTitle(): void {
    switch (this.type) {
      case 'home-page-suggestion-list':
        this.title = 'Suggestion For You';
        break;
      case 'discover-people-list':
        this.title = 'Suggested';
        break;
      case 'share-modal':
        this.title = 'Suggested';
        break;
      case 'chat-setting':
        this.title = 'Members';
        break;
      case 'like-modal':
        this.isTitle = false;
        break;
      case 'followers-list':
        this.title = '';
        break;
      case 'following-list':
        this.title = '';
        break;
      case 'search-bar-list':
        this.isTitle = false;
        break;
      default:
        this.isTitle = false;
        break;
    };
  };

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  };
};