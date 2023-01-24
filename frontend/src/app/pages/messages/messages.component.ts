import { switchMap } from 'rxjs/operators';
import { Chat } from './../../models/chat.model';
import { ChatService } from './../../services/chat.service';
import { User, MiniUser } from './../../models/user.model';
import { map, Subscription, Observable } from 'rxjs';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));

  }

  store = inject(Store<State>);
  $location = inject(Location);
  chatService = inject(ChatService);
  userSub!: Subscription;
  chatSub!: Subscription;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  users: MiniUser[] = [];
  chats$ = this.chatService.chats$;
  faChevronLeft = faChevronLeft;
  isShareModalShown = false;
  currActiveChat!: Chat | null;

  ngOnInit(): void {
    let isChatLoaded = false;

    this.userSub = this.loggedinUser$.pipe(
      switchMap(user => {
        if (user) {
          this.loggedinUser = user;
        }
        return this.chats$
      }
      )).subscribe(chats => {
        if (!chats.length && this.loggedinUser && !isChatLoaded) {
          this.chatService.loadChats(this.loggedinUser.id);
          isChatLoaded = true;
        }
        console.log('chats', chats);
      })
  }

  onToggleShareModal() {
    this.isShareModalShown = !this.isShareModalShown;
  }

  onSelectChat(chat: Chat) {
    this.currActiveChat = { ...chat };
  }

  onClearChat() {
    this.currActiveChat = null;
  }

  onGoBack() {
    this.$location.back()
  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
