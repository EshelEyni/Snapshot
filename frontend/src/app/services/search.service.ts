import { map, Observable, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
  http = inject(HttpClient);

  public async search(searchTerm: string): Promise<{ users: User[], tags: Tag[] }> {
    searchTerm = searchTerm.toLowerCase();
    let users: User[] = await lastValueFrom(this._getUsers(searchTerm));
    let tags = await lastValueFrom(this._getTags(searchTerm));
    return { users: [...users], tags: [...tags] }
  }

  private _getUsers(filterBy: string): Observable<User[]> {
    return this.http.get(`http://localhost:3030/api/user/${filterBy}`).pipe(map(users => {
      return users as User[]
    }))
  }

  private _getTags(filterBy: string): Observable<Tag[]> {
    return this.http.get(`http://localhost:3030/api/tag/${filterBy}`).pipe(map(tags => {
      return tags as Tag[]
    }))
  }
}
