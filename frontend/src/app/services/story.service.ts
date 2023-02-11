import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { Story } from './../models/story.model';
import {
  BehaviorSubject,
  firstValueFrom,
  Observable,
  lastValueFrom,
} from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { MiniUser } from '../models/user.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private _stories$ = new BehaviorSubject<Story[]>([]);
  public stories$ = this._stories$.asObservable();

  private _highlightedStories$ = new BehaviorSubject<Story[]>([]);
  public highlightedStories$ = this._highlightedStories$.asObservable();

  constructor() {}
  storageService = inject(StorageService);
  userService = inject(UserService);
  http = inject(HttpClient);
  httpService = inject(HttpService);

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl();

  public async loadStories(type: string): Promise<void> {
    const options = { withCredentials: true, params: { type } };

    const stories = await firstValueFrom(
      this.http.get<Story[]>(`${this.baseUrl}/story`, options)
    );

    if (type !== 'profile-details') {
      this._stories$.next(stories);
    } else {
      this._highlightedStories$.next(stories);
    }
  }

  public getById(storyId: number): Observable<Story> {
    const options = {
      withCredentials: true,
    };
    return this.http.get<Story>(`${this.baseUrl}/story/${storyId}`, options);
  }

  public async remove(storyId: number): Promise<boolean> {
    const options = { withCredentials: true };
    const res = await lastValueFrom(
      this.http.delete<{ msg: string }>(
        `${this.baseUrl}/story/${storyId}`,
        options
      )
    );

    if (res.msg === 'Story deleted') {
      const stories = this._stories$.getValue();
      const idx = stories.findIndex((story) => story.id === storyId);
      stories.splice(idx, 1);
      this._stories$.next(stories);
      return true;
    }
    return false;
  }

  public save(story: Story): Promise<number | void> {
    if (story.id) {
      return this._update(story);
    } else {
      return this._add(story);
    }
  }

  private async _add(story: Story): Promise<number | void> {
    const options = { withCredentials: true };
    const res = (await firstValueFrom(
      this.http.post(`${this.baseUrl}/story`, story, options)
    )) as { msg: string; id: number };

    if (res.msg === 'Story added') {
      const stories = this._stories$.getValue();
      story.id = res.id;
      stories.unshift(story);
      this._stories$.next(stories);
      return res.id;
    }
  }

  private async _update(story: Story): Promise<void> {
    const options = { withCredentials: true };
    const res = (await firstValueFrom(
      this.http.put(`${this.baseUrl}/story/${story.id}`, story, options)
    )) as { msg: string };

    if (res.msg === 'Story updated' && story.isSaved) {
      const stories = this._highlightedStories$.getValue();
      stories.unshift(story);
      this._highlightedStories$.next(stories);
    }
  }

  public getEmptyStory(): Story {
    return {
      id: 0,
      imgUrls: [],
      by: this.userService.getEmptyMiniUser(),
      createdAt: new Date(),
      isArchived: false,
      isSaved: false,
      isLiked: false,
      highlightTitle: null,
      highlightCover: null,
    };
  }

  public async addStoryView(storyId: number) {
    const options = { withCredentials: true };
    await firstValueFrom(
      this.http.put(`${this.baseUrl}/story/views/${storyId}`, null, options)
    );
  }
}
