import { MiniUser } from './../../models/user.model';
import { Tag } from '../../models/tag.model';
import { User } from 'src/app/models/user.model';
import { TagService } from './../../services/tag.service';
import { SearchService } from './../../services/search.service';
import { Component, OnInit, inject, EventEmitter, OnChanges } from '@angular/core';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  inputs: ['isUserSearch', 'usersToSend', 'loggedinUser'],
  outputs: ['searchFinished', 'removeUser', 'inputFocused']
})
export class SearchBarComponent implements OnInit, OnChanges {

  constructor() {
  }

  searchService = inject(SearchService)
  tagService = inject(TagService)

  searchFinished = new EventEmitter<{
    searchResult: { users: User[], tags: Tag[] },
    isClearSearch: boolean
  }>();
  removeUser = new EventEmitter<MiniUser>();
  inputFocused = new EventEmitter<boolean>();
  searchSubject = new Subject<string>();


  faCircleXmark = faCircleXmark;
  faMagnifyingGlass = faMagnifyingGlass;
  searchTerm: string = ''
  isLoading: boolean = false;
  isUserSearch: boolean = false;
  isInputFocused: boolean = false;
  loggedinUser!: User;


  usersToSend!: MiniUser[];
  searchResults: { users: User[], tags: Tag[] } = { users: [], tags: [] }
  userSearchResults: User[] = []

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(1000))
      .subscribe(searchTerm => {
        this.handleSearch();
      });
  }

  ngOnChanges() {
    // this.usersToSend = [...this.usersToSend]
    // console.log('this.usersToSend', this.usersToSend);
  }

  onFocus() {
    this.isInputFocused = true
    this.inputFocused.emit(true)
  }

  onClearSearch() {
    this.searchTerm = ''
    this.searchResults = { users: [], tags: [] }
    this.isInputFocused = false
    this.searchFinished.emit(
      {
        searchResult: { users: [], tags: [] },
        isClearSearch: true
      }
    )
  }

  onChange() {
    this.searchSubject.next(this.searchTerm);
  }

  onRemoveUser(user: MiniUser) {
    this.removeUser.emit(user)
  }


  async handleSearch() {
    if (!this.searchTerm) {
      this.searchResults = { users: [], tags: [] }
      this.searchFinished.emit(
        {
          searchResult: { users: [], tags: [] },
          isClearSearch: true
        }
      )
      this.isLoading = false
      return
    }

    if (!this.isUserSearch) {
      this.isLoading = true
      this.searchResults = await this.searchService.search(this.searchTerm)
      this.searchFinished.emit(
        {
          searchResult: { users: this.searchResults.users, tags: this.searchResults.tags },
          isClearSearch: false
        }
      )
      this.isLoading = false

    }
    else {
      this.userSearchResults = await this.searchService.searchForUsers(this.searchTerm)
      this.userSearchResults = this.userSearchResults.filter(user => {
        return !this.usersToSend.some(u => u.id === user.id) && user.id !== this.loggedinUser.id
      })
      this.searchFinished.emit(
        {
          searchResult: { users: this.userSearchResults, tags: [] },
          isClearSearch: false
        }
      )
    }

  }

}