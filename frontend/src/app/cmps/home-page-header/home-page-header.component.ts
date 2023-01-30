import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map } from 'rxjs';
import { SearchService } from './../../services/search.service';
import { UserService } from 'src/app/services/user.service';
import { Tag } from './../../models/tag.model';
import { User } from 'src/app/models/user.model';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'home-page-header',
  templateUrl: './home-page-header.component.html',
  styleUrls: ['./home-page-header.component.scss']
})
export class HomePageHeaderComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  }

  userService = inject(UserService);
  searchService = inject(SearchService);
  store = inject(Store<State>);

  sub: Subscription | null = null;

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  searchResults: any[] = [];
  recentSearches: any[] = [];

  isSearchModalShown = false;
  isRecentSearchShown = true;
  isNoResults = false;


  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(async user => {
      if (user) {
        this.loggedinUser = { ...user };
        this.recentSearches = await this.searchService.getRecentSearches(this.loggedinUser.id);
      };
    });
  };

  onSearchFinished(res: { searchResult: { users: User[], tags: Tag[] }, isClearSearch: boolean }): void {
    if (res.isClearSearch) {
      this.searchResults = [];
      this.isRecentSearchShown = true;
      this.isNoResults = false;
      return;
    };
    const searchResults = res.searchResult;
    this.searchResults = [...searchResults.users, ...searchResults.tags];
    this.isRecentSearchShown = false;
    this.isNoResults = this.searchResults.length === 0;
  };

  onOpenModal(): void {
    this.isSearchModalShown = true;
  };

  onCloseModal(): void {
    this.isSearchModalShown = false;
  };

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  };
};