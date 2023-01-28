import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { Story } from './../models/story.model';
import { BehaviorSubject, firstValueFrom, Observable, lastValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { MiniUser } from '../models/user.model';

const BASE_URL = process.env['NODE_ENV'] === 'production'
  ? '/api/'
  : '//localhost:3030/api';


@Injectable({
  providedIn: 'root'
})

export class StoryService {

  private _stories$ = new BehaviorSubject<Story[]>([]);
  public stories$ = this._stories$.asObservable();

  private _highlightedStories$ = new BehaviorSubject<Story[]>([]);
  public highlightedStories$ = this._highlightedStories$.asObservable();

  constructor() { }
  storageService = inject(StorageService);
  userService = inject(UserService);
  http = inject(HttpClient);

  public async loadStories(filter: { userId: number, type: string }) {
    let options = { params: {} }
    options.params = {
      userId: filter.userId,
      type: filter.type
    }

    const stories = await firstValueFrom(
      this.http.get<Story[]>(`${BASE_URL}/story`, options),
    )

    if (filter.type !== 'profile-details') {
      this._stories$.next(stories);
    }
    else {
      this._highlightedStories$.next(stories);
    }
  }

  public getById(storyId: number, type: string): Observable<Story> {
    let options = { params: { type } }
    return this.http.get<Story>(`${BASE_URL}/story/${storyId}`, options)
  }

  public async remove(storyId: number): Promise<boolean> {
    const res = await lastValueFrom(
      this.http.delete<{ msg: string }>(`${BASE_URL}/story/${storyId}`)
    )

    if (res.msg === 'Story deleted') {
      const stories = this._stories$.getValue()
      const idx = stories.findIndex(story => story.id === storyId)
      stories.splice(idx, 1)
      this._stories$.next(stories);
      return true
    }
    return false
  }

  public save(story: Story) {
    if (story.id) {
      return this._update(story);
    } else {
      return this._add(story);
    }
  }

  private async _add(story: Story): Promise<number | void> {
    const res = await firstValueFrom(
      this.http.post(`${BASE_URL}/story`, story),
    ) as { msg: string, id: number }

    if (res.msg === 'Story added') {
      const stories = this._stories$.getValue()
      story.id = res.id
      stories.unshift(story)
      this._stories$.next(stories);
      return res.id
    }
  }

  private async _update(story: Story): Promise<void> {
    const res = await firstValueFrom(
      this.http.put(`${BASE_URL}/story/${story.id}`, story),
    ) as { msg: string }

    if (res.msg === 'Story updated' && story.isSaved) {
      const stories = this._highlightedStories$.getValue()
      stories.unshift(story)
      this._highlightedStories$.next(stories);
    }
  }


  public getEmptyStory(): Story {
    return {
      id: 0,
      imgUrls: [],
      by: this.userService.getEmptyMiniUser(),
      viewedBy: [],
      createdAt: new Date(),
      isArchived: false,
      isSaved: false,
      highlightTitle: null,
      highlightCover: null,
    }
  }


  public async addStoryView(user: MiniUser, storyId: number) {
    await firstValueFrom(
      this.http.put(`${BASE_URL}/story/views/${storyId}`, user),
    )
  }
}