import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { PostService } from './post.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import {
  BehaviorSubject,
  Observable,
  lastValueFrom,
  firstValueFrom,
} from 'rxjs';
import { Tag } from '../models/tag.model';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private _tags$ = new BehaviorSubject<Tag[]>([]);
  public tags$ = this._tags$.asObservable();

  constructor() {}

  userSerivce = inject(UserService);
  storageService = inject(StorageService);
  postService = inject(PostService);
  http = inject(HttpClient);
  httpService = inject(HttpService);

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl();

  public getTags(filter: {
    type: string;
    name?: string;
    userId?: number;
  }): Observable<Tag[]> {
    const { type, name, userId } = filter;
    const options: {
      withCredentials: boolean;
      params: {
        type: string;
        name?: string;
        userId?: number;
      };
    } = {
      withCredentials: true,
      params: {
        type,
      },
    };
    if (name) options.params = { ...options.params, name: name };
    if (userId) options.params = { ...options.params, userId: userId };
    return this.http.get<Tag[]>(`${this.baseUrl}/tag`, options);
  }

  public getByName(tagName: string): Observable<Tag> {
    const options = { withCredentials: true };
    return this.http.get<Tag>(`${this.baseUrl}/tag/${tagName}`, options);
  }

  public async toggleFollow(
    isFollowing: boolean,
    tagId: number
  ): Promise<void> {
    const options = { withCredentials: true };
    if (isFollowing) {
      await firstValueFrom(
        this.http.delete(`${this.baseUrl}/follow-tag/${tagId}`, options)
      );
    } else {
      await firstValueFrom(
        this.http.post(`${this.baseUrl}/follow-tag`, { tagId }, options)
      );
    }
  }
}
