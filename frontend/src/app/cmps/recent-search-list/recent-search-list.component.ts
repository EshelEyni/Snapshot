import { Store } from '@ngrx/store';
import { State } from 'src/app/store/store';
import { User } from 'src/app/models/user.model';
import { map, Subscription, Observable } from 'rxjs';
import { SearchService } from './../../services/search.service';
import { Component, OnInit, EventEmitter, inject, OnDestroy } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'recent-search-list',
  templateUrl: './recent-search-list.component.html',
  styleUrls: ['./recent-search-list.component.scss'],
  inputs: ['recentSearches', 'isRecentSearchShown', 'isNoResults'],
  outputs: ['close']
})
export class RecentSearchListComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  searchService = inject(SearchService);
  store = inject(Store<State>);

  close = new EventEmitter();
  recentSearches!: any[];
  isRecentSearchShown!: boolean;
  isNoResults!: boolean;

  faX = faX


  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(async user => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
      }
    })
  }

  onRemoveSearch(searchId: number) {
    this.recentSearches = this.recentSearches.filter(x => x.id !== searchId)
    this.searchService.removeRecentSearch(searchId)
  }

  onClearSearches() {
    this.recentSearches = []
    this.searchService.clearRecentSearches(this.loggedinUser.id)
  }

  onCloseModal() {
    this.close.emit()
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }
}
