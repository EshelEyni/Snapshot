import { MiniUser } from './../../models/user.model';
import { Tag } from '../../models/tag.model';
import { User } from 'src/app/models/user.model';
import { TagService } from './../../services/tag.service';
import { SearchService } from './../../services/search.service';
import { UtilService } from './../../services/util.service';
import { Component, OnInit, inject, EventEmitter, OnChanges } from '@angular/core';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  inputs: ['isUserSearch', 'usersToSend'],
  outputs: ['searchFinished', 'recentSearches', 'removeUser']
})
export class SearchBarComponent implements OnInit, OnChanges {

  constructor() {
  }

  utilService = inject(UtilService)
  searchService = inject(SearchService)
  tagService = inject(TagService)

  searchFinished = new EventEmitter<{ users: User[], tags: Tag[] }>();
  removeUser = new EventEmitter<MiniUser>();

  faCircleXmark = faCircleXmark;
  searchTerm: string = ''
  isLoading: boolean = false;
  isUserSearch: boolean = false;

  usersToSend!: MiniUser[];
  searchResults: { users: User[], tags: Tag[] } = { users: [], tags: [] }
  userSearchResults: User[] = []

  ngOnInit(): void {
    // console.log('this.usersToSend', this.usersToSend);
  }

  ngOnChanges() {
    // this.usersToSend = [...this.usersToSend]
    // console.log('this.usersToSend', this.usersToSend);
  }

  onClearSearch() {
    this.searchTerm = ''
    this.searchResults = { users: [], tags: [] }
  }

  onChange() {
    this.handleSearch()
  }

  onRemoveUser(user: MiniUser) {
    this.removeUser.emit(user)
  }


  async handleSearch() {
    if (!this.isUserSearch) {
      this.isLoading = true
      this.searchResults = await this.searchService.search(this.searchTerm)
      this.searchFinished.emit(this.searchResults)
      this.isLoading = false
    } else {
      this.userSearchResults = await this.searchService.searchForUsers(this.searchTerm)
      this.searchFinished.emit(this.searchResults)
    }

  }

}
