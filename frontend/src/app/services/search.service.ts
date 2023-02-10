import { HttpService } from './http.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../models/tag.model';
import { User } from 'src/app/models/user.model';
import { TagService } from './tag.service';
import { UserService } from './user.service';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor() {}

  userService = inject(UserService);
  tagService = inject(TagService);
  http = inject(HttpClient);
  httpService = inject(HttpService);

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl();

  public async search(
    searchTerm: string
  ): Promise<{ users: User[]; tags: Tag[] }> {
    searchTerm = searchTerm.toLowerCase();
    const users: User[] = await lastValueFrom(
      this.userService.getUsersBySearchTerm(searchTerm)
    );
    const filterBy = { type: 'search', name: searchTerm}
    const tags: Tag[] = await lastValueFrom(
      this.tagService.getTags(filterBy)
    );
    return { users: [...users], tags: [...tags] };
  }

  public async searchForUsers(searchTerm: string): Promise<User[]> {
    searchTerm = searchTerm.toLowerCase();
    return await lastValueFrom(
      this.userService.getUsersBySearchTerm(searchTerm)
    );
  }

  public async getRecentSearches(userId: number): Promise<Array<User | Tag>> {
    const recentSearches = await lastValueFrom(
      this.http.get<Array<User | Tag>>(`${this.baseUrl}/search/${userId}`)
    );
    return recentSearches;
  }

  public async saveRecentSearch(
    userId: number,
    searchItem: User | Tag
  ): Promise<void> {
    await lastValueFrom(
      this.http.post(`${this.baseUrl}/search`, {
        userId,
        itemId: searchItem.id,
        type: 'username' in searchItem ? 'user' : 'tag',
      })
    );
  }

  public async removeRecentSearch(searchId: number): Promise<void> {
    await lastValueFrom(this.http.delete(`${this.baseUrl}/search/${searchId}`));
  }

  public async clearRecentSearches(userId: number): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.baseUrl}/search/clear/${userId}`)
    );
  }
}
