import { Observable, Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from './../../store/store';
import { MiniUser } from './../../models/user.model';
import { Component, OnInit, OnChanges, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  inputs: ['users', 'usersToSend', 'type'],
  outputs: ['addUser', 'removeUser']
})
export class UserListComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private store: Store<State>

  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  users!: MiniUser[];
  usersToSend!: MiniUser[];
  type!: string;

  isTitle: boolean = true;
  title: string = '';
  isFollowBtnShow: boolean = false;

  isSelectUser: { userId: number, idx: number, isSelected: boolean }[] = [];
  addUser = new EventEmitter<MiniUser>();
  removeUser = new EventEmitter<MiniUser>();


  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = {...user}
      }
    })
    this.setTitle();

    this.isFollowBtnShow = this.type === 'like-modal' || this.type === 'suggestion-list'
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.users = this.users;

    if (this.type === 'share-modal') {
      this.setIsSelectUser();
    }

    if (changes['usersToSend']) {
      this.usersToSend = this.usersToSend;
      console.log('this.uersToSend', this.usersToSend);
    }

  }

  setIsSelectUser() {
    this.isSelectUser = this.users.map((user, idx) => {
      const isUserSelected = this.usersToSend.some((userToSend) => userToSend.id === user.id);
      return { userId: user.id, idx, isSelected: isUserSelected };
    });
  }

  onToggleSelectUser(idx: number) {
    this.isSelectUser[idx].isSelected = !this.isSelectUser[idx].isSelected;
    if (this.isSelectUser[idx].isSelected) {
      this.addUser.emit(this.users[idx]);
    } else {
      this.removeUser.emit(this.users[idx]);
    }
  }

  onRemoveUser(idx: number) {
    this.removeUser.emit(this.users[idx]);
  }


  setTitle() {
    switch (this.type) {
      case 'suggestion-list':
        this.title = 'Suggestion For You';
        break;
      case 'share-modal':
        this.title = 'Suggested';
        break;
      case 'like-modal':
        this.isTitle = false;
        break;
      // case 'followers-list':
      //   this.title = 'Followers';
      //   break;
      // case 'followings-list':
      //   this.title = 'Followings';
      //   break;
      case 'search-list':
        this.title = 'Search Results';
        break;
      case 'search-bar-list':
        this.isTitle = false;
        break;
      default:
        this.title = 'Users';
        break;
    }

  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}
