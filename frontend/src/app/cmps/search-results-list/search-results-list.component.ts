import { Observable, map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/store';
import { SearchService } from './../../services/search.service';
import { UserService } from 'src/app/services/user.service';
import { Tag } from './../../models/tag.model';
import { User } from 'src/app/models/user.model';
import { Component, OnInit, EventEmitter, inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'search-results-list',
  templateUrl: './search-results-list.component.html',
  styleUrls: ['./search-results-list.component.scss'],
  inputs: ['searchResults', 'recentSearches', 'isRecentSearchShown', 'isNoResults'],
  outputs: ['close']
})
export class SearchResultsListComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }

  userService = inject(UserService);
  searchService = inject(SearchService);
  store = inject(Store<State>);

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  close = new EventEmitter();
  searchResults!: any[];
  recentSearches!: any[];
  isRecentSearchShown!: boolean;
  isNoResults!: boolean;


  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(async user => {
      if (user) {
        this.loggedinUser = {...user}
      }
    })
  }

  onSaveSearch(content: User | Tag) {
    this.onCloseModal()
    if (this.recentSearches.some(x => x.id === content.id)) return
    this.searchService.saveRecentSearch(this.loggedinUser.id, content)
  }

  onCloseModal() {
    this.close.emit()
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

}
