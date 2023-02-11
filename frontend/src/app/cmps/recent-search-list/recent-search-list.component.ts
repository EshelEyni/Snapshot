import { Store } from '@ngrx/store';
import { State } from 'src/app/store/store';
import { User } from 'src/app/models/user.model';
import { map, Subscription, Observable } from 'rxjs';
import { SearchService } from './../../services/search.service';
import {
  Component,
  OnInit,
  EventEmitter,
  inject,
  OnDestroy,
} from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'recent-search-list',
  templateUrl: './recent-search-list.component.html',
  styleUrls: ['./recent-search-list.component.scss'],
  inputs: ['recentSearches', 'isRecentSearchShown', 'isNoResults'],
  outputs: ['close'],
})
export class RecentSearchListComponent implements OnInit, OnDestroy {
  constructor() {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser));
  }

  searchService = inject(SearchService);
  store = inject(Store<State>);

  faX = faX;

  sub: Subscription | null = null;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  recentSearches!: { id: number; type: string; item: any }[];

  isRecentSearchShown!: boolean;
  isNoResults!: boolean;

  close = new EventEmitter();

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(async (user) => {
      if (user) {
        this.loggedinUser = { ...user };
      }
    });
  }

  onRemoveSearch(searchId: number): void {
    this.recentSearches = this.recentSearches.filter((x) => x.id !== searchId);
    this.searchService.removeRecentSearch(searchId);
  }

  onClearSearches(): void {
    this.recentSearches = [];
    this.searchService.clearRecentSearches();
  }

  onCloseModal(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
