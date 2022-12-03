import { LoadUsers } from './../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { State } from './../store/store';
import { TagService } from './tag.service';
import { UserService } from './user.service';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  userService = inject(UserService);
  tagService = inject(TagService);
  store = inject(Store<State>);

  public search(searchTerm: string) {
    console.log('searching for', searchTerm);
    this.store.dispatch(new LoadUsers(searchTerm))
    this.tagService.loadTags(searchTerm)
  }
}
