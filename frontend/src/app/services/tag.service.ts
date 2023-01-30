import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { PostService } from './post.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { BehaviorSubject, Observable, lastValueFrom, firstValueFrom } from 'rxjs';
import { Tag } from '../models/tag.model';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TagService {

  private _tags$ = new BehaviorSubject<Tag[]>([]);
  public tags$ = this._tags$.asObservable();

  constructor() { }

  userSerivce = inject(UserService);
  storageService = inject(StorageService);
  postService = inject(PostService);
  http = inject(HttpClient);
  httpService = inject(HttpService);

  baseUrl = this.httpService.getBaseUrl();

  public async loadTags(filterBy = { name: '' }): Promise<void> {
    const tags = await lastValueFrom(this.getTags(filterBy));
    this._tags$.next(tags);
  };

  public getTags(filterBy = { name: '' }): Observable<Tag[]> {
    let options = { params: {} };
    if (filterBy) {
      options.params = {
        name: filterBy.name,
      }
    };
    return this.http.get<Tag[]>(`${this.baseUrl}/tag`, options);
  };

  public getByName(tagName: string): Observable<Tag> {
    return this.http.get<Tag>(`${this.baseUrl}/tag/${tagName}`);
  };

  public remove(tagId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tag/${tagId}`);
  };

  public save(tag: Tag): Promise<number | Tag | void> {
    return tag.id ? this._update(tag) : this._add(tag);
  };

  private async _update(tag: Tag): Promise<Tag> {
    return firstValueFrom(
      this.http.put(`${this.baseUrl}/tag/${tag.id}`, tag)
    ) as unknown as Tag;
  };

  private async _add(tag: Tag): Promise<number | void> {
    const res = await firstValueFrom(
      this.http.post(`${this.baseUrl}/tag`, tag)
    ) as { msg: string, id: number }

    if (res.msg === 'Tag added') {
      return res.id;
    } else {
      return;
    }
  }

  public async getfollowedTags(userId: number): Promise<Tag[]> {
    const tags = await lastValueFrom(
      this.http.get<Tag[]>(`${this.baseUrl}/tag/follow/${userId}`)
    );
    return tags;
  };


  public async checkIsFollowing(userId: number, tagId: number): Promise<boolean> {
    const isFollowing = await lastValueFrom(
      this.http.get(`${this.baseUrl}/tag/follow/${userId}/${tagId}`)
    ) as boolean;
    return isFollowing;
  };


  public async toggleFollow(isFollowing: boolean, userId: number, tagId: number): Promise<number | void> {
    if (isFollowing) {
      await firstValueFrom(
        this.http.delete(`${this.baseUrl}/tag/follow/${userId}/${tagId}`)
      );
    }
    else {
      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/tag/follow`, { userId, tagId })
      ) as { msg: string, id: number };

      if (res.msg === 'Tag followed') {
        return res.id;
      } else {
        return;
      };
    };
  };

  public detectTags(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = text.match(hashtagRegex);
    const tags: string[] = [];
    if (hashtags) {
      hashtags.forEach((hashtag) => {
        const tag = hashtag.substring(1);
        tags.push(tag);
      });
    };
    return tags;
  };

};