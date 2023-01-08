import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../models/tag.model';
import { User } from 'src/app/models/user.model';
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
  http = inject(HttpClient);


  public async search(searchTerm: string): Promise<{ users: User[], tags: Tag[] }> {
    searchTerm = searchTerm.toLowerCase();
    let users: User[] = await lastValueFrom(this.userService.getUsersBySearchTerm(searchTerm));
    let tags = await lastValueFrom(this.tagService.getTags({ name: searchTerm }));
    return { users: [...users], tags: [...tags] }
  }

  public async searchForUsers(searchTerm: string): Promise<User[]> {
    searchTerm = searchTerm.toLowerCase();
    return await lastValueFrom(this.userService.getUsersBySearchTerm(searchTerm));
  }

  public async getRecentSearches(userId: number): Promise<Array<User | Tag>> {
    const recentSearches = await lastValueFrom(
      this.http.get<Array<User | Tag>>(
        `http://localhost:3030/api/search/${userId}`
      )
    );
    return recentSearches;
  }

  public async saveRecentSearch(userId: number, searchItem: User | Tag) {
    await lastValueFrom(
      this.http.post(
        `http://localhost:3030/api/search`,
        {
          userId,
          itemId: searchItem.id,
          type: 'username' in searchItem ? 'user' : 'tag'
        }
      )
    );
  }

  public async removeRecentSearch(searchId: number) {
    await lastValueFrom(
      this.http.delete(
        `http://localhost:3030/api/search/${searchId}`
      )
    );
  }

  public async clearRecentSearches(userId: number) {
    await lastValueFrom(
      this.http.delete(
        `http://localhost:3030/api/search/clear/${userId}`
      )
    );
  }
}