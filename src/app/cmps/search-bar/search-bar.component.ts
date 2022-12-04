import { Tag } from '../../models/tag.model';
import { User } from 'src/app/models/user.model';
import { TagService } from './../../services/tag.service';
import { SearchService } from './../../services/search.service';
import { UtilService } from './../../services/util.service';
import { Component, OnInit, inject, EventEmitter } from '@angular/core';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  outputs: ['searchFinished', 'recentSearches']
})
export class SearchBarComponent implements OnInit {
  
  constructor() {
  }
  
  utilService = inject(UtilService)
  searchService = inject(SearchService)
  tagService = inject(TagService)
  
  searchFinished = new EventEmitter<{ users: User[], tags: Tag[]}>();
  faCircleXmark = faCircleXmark;
  searchTerm: string = ''
  isLoading: boolean = false;
  searchResults: { users: User[], tags: Tag[] } = { users: [], tags: [] }

  ngOnInit(): void {


  }

  onClearSearch() {
    this.searchTerm = ''
    this.searchResults = { users: [], tags: [] }
  }

  onChange() {
    this.handleSearch()
  }

  async handleSearch() {
    this.isLoading = true
    const res = await this.searchService.search(this.searchTerm)
    this.searchResults = res
    this.searchFinished.emit(this.searchResults)

    this.isLoading = false

  }

}
