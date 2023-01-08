import { SearchService } from './../../services/search.service';
import { UserService } from 'src/app/services/user.service';
import { SaveUser } from './../../store/actions/user.actions';
import { Observable, Subscription, map } from 'rxjs';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { Tag } from '../../models/tag.model';
import { User } from './../../models/user.model';
import { Component, OnInit, EventEmitter, OnDestroy, inject, OnChanges } from '@angular/core';

@Component({
  selector: 'search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
  outputs: ['onClose']
})
export class SearchModalComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  }

  userService = inject(UserService);
  searchService = inject(SearchService);

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;
  onClose = new EventEmitter();
  searchResults: any[] = []
  recentSearches: any[] = []
  isRecentSearchShown = true
  isNoResults = false


  async ngOnInit() {
    this.sub = this.loggedinUser$.subscribe(async user => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
        this.recentSearches = await this.searchService.getRecentSearches(this.loggedinUser.id)
      }
    })
  }

  onSearchFinished(res: { searchResult: { users: User[], tags: Tag[] }, isClearSearch: boolean }) {
    if (res.isClearSearch) {
      this.searchResults = []
      this.isRecentSearchShown = true
      this.isNoResults = false
      return
    }
    const searchResults = res.searchResult
    this.searchResults = [...searchResults.users, ...searchResults.tags]
    this.isRecentSearchShown = false
    this.isNoResults = this.searchResults.length === 0
  }

  onCloseModal() {
    this.onClose.emit()
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}