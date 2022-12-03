import { TagService } from './../../services/tag.service';
import { Tag } from './../../models/tag';
import { Observable, map, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { SearchService } from './../../services/search.service';
import { UtilService } from './../../services/util.service';
import { Component, OnInit, inject } from '@angular/core';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  outputs: ['searchResults', 'recentSearches']
})
export class SearchBarComponent implements OnInit {

  constructor() {
    this.users$ = this.store.select('userState').pipe(map(x => x.users));
    this.tags$ = this.tagService.tags$;
  }

  utilService = inject(UtilService)
  searchService = inject(SearchService)
  tagService = inject(TagService)
  store = inject(Store<State>)

  users$: Observable<User[] | null>;
  users: User[] = []
  tags$!: Observable<Tag[]>;
  tags!: Tag[];
  subUsers: Subscription | null = null;
  subTags: Subscription | null = null

  faCircleXmark = faCircleXmark;
  searchTerm: string = ''
  isLoading: boolean = false;
  searchResults: any[] = []

  ngOnInit(): void {

    this.subUsers = this.users$.subscribe(users => {
      if (users) {
        this.users = JSON.parse(JSON.stringify(users))
      }
    })

    this.subTags = this.tags$.subscribe(tags => {
      if (tags) {
        this.tags = JSON.parse(JSON.stringify(tags))
      }
    })
  }

  onClearSearch() {
    this.searchTerm = ''
    this.searchResults = []
  }

  async onChange() {
    this.isLoading = true
    this.searchService.search(this.searchTerm)

    console.log('this.users', this.users)
    console.log('this.searchResults', this.searchResults)
    this.isLoading = false
  }


  ngOnDestroy() {
    this.subUsers?.unsubscribe()
    this.subTags?.unsubscribe()
  }

}
