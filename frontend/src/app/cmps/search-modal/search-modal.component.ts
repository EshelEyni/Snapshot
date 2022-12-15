import { UserService } from 'src/app/services/user.service';
import { SaveUser } from './../../store/actions/user.actions';
import { Observable, Subscription, map } from 'rxjs';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { Tag } from '../../models/tag.model';
import { User } from './../../models/user.model';
import { Component, OnInit, EventEmitter, OnDestroy, inject } from '@angular/core';

@Component({
  selector: 'search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
  outputs: ['onClose']
})
export class SearchModalComponent implements OnInit ,OnDestroy{

  constructor(
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  }

  userService = inject(UserService);

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;
  onClose = new EventEmitter();
  searchResults: any[] = []
  recentSearches: any[] = []

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
        // this.recentSearches = this.loggedinUser.recentSearches
      }
    })
  }

  onSearchFinished(searchResults: any) {
    this.searchResults = [...searchResults.users, ...searchResults.tags]
    console.log('this.searchResults', this.searchResults);
  }

  onSaveSearch(content: User | Tag) {
    this.onCloseModal()
    if (this.recentSearches.some(x => x.id === content.id)) return
    this, this.recentSearches.unshift(content)
    // this.loggedinUser.recentSearches.unshift(content)
    this.store.dispatch(new SaveUser(this.loggedinUser))
  }

  onCloseModal() {
    this.onClose.emit()
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}
