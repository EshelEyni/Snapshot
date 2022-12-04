import { Tag } from '../models/tag.model';
import { User } from 'src/app/models/user.model';
import { LoadUsers } from './../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { State } from './../store/store';
import { TagService } from './tag.service';
import { UserService } from './user.service';
import { Injectable, inject } from '@angular/core';
import { asyncStorageService } from './async-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  userService = inject(UserService);
  tagService = inject(TagService);

  public async search(searchTerm: string): Promise<{ users: User[], tags: Tag[] }> {
    searchTerm = searchTerm.toLowerCase();
    let users = await asyncStorageService.query('user') as User[];
    users = users.filter(user => user.username.toLowerCase().includes(searchTerm) || user.bio.toLowerCase().includes(searchTerm))
    let tags = await asyncStorageService.query('tag') as Tag[];
    tags = tags.filter(tag => tag.name.toLowerCase().includes(searchTerm))

    return { users: [...users], tags: [...tags] }
  }
}
