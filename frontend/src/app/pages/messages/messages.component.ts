import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Chat } from './../../models/chat.model';
import { ChatService } from './../../services/chat.service';
import { User, MiniUser } from './../../models/user.model';
import { map, Subscription, Observable, lastValueFrom } from 'rxjs';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, inject, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  }

  @ViewChildren('svgIcon') icons!: QueryList<SvgIconComponent>;

  route = inject(ActivatedRoute)
  store = inject(Store<State>);
  $location = inject(Location);
  chatService = inject(ChatService);

  faChevronLeft = faChevronLeft;

  userSub!: Subscription;
  chatSub!: Subscription;
  queryParamsSubscription!: Subscription;

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  users: MiniUser[] = [];
  chats$ = this.chatService.chats$;
  currActiveChat!: Chat | null;

  iconColor: string = 'var(--tertiary-color)';

  isShareModalShown = false;

  ngOnInit(): void {
    let isChatLoaded = false;

    this.userSub = this.loggedinUser$.pipe(
      switchMap(user => {
        if (user) {
          this.loggedinUser = user;
          setTimeout(() => {
            this.setIconColor();
          }, 0);
        };
        return this.chats$;
      }
      )).pipe(
        switchMap(chats => {
          if (!chats.length && this.loggedinUser && !isChatLoaded) {
            this.chatService.loadChats();
            isChatLoaded = true;
          };
          return this.route.queryParams;
        }
        )).subscribe(params => {
          if (params['chatId']) {
            this.chats$.forEach(data => {
              if (!data) return;
              const chats = data;
              const queryParamsChatId = +params['chatId'];
              const chat = chats.find(c => c.id === queryParamsChatId);
              if (chat) {
                this.currActiveChat = { ...chat };
              };
            });
          };
        });
  };

  setIconColor() {
    this.iconColor = this.loggedinUser.isDarkMode ? 'var(--primary-color)' : 'var(--tertiary-color)';
    this.icons.forEach(icon => {
      icon.svgStyle = { color: this.iconColor, fill: this.iconColor };
    });
  };

  onToggleShareModal(): void {
    this.isShareModalShown = !this.isShareModalShown;
  };

  onSelectChat(chat: Chat): void {
    this.currActiveChat = { ...chat };
  };

  onClearChat(): void {
    this.currActiveChat = null;
  };

  onGoBack(): void {
    this.$location.back();
  };

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  };
};