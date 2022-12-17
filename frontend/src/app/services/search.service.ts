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
    let users: User[] = await lastValueFrom(this.userService.getUsers(searchTerm));
    let tags = await lastValueFrom(this.tagService.getTags({ name: searchTerm }));
    return { users: [...users], tags: [...tags] }
  }




}
