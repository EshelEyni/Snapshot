import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { Story } from './../models/story.model';
import { BehaviorSubject, firstValueFrom, from, Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { asyncStorageService } from './async-storage.service';

const STORIES: Story[] = []

const ENTITY = 'story';

@Injectable({
  providedIn: 'root'
})

export class StoryService {

  private _storiesDb = STORIES;
  private _stories$ = new BehaviorSubject<Story[]>(this._storiesDb);
  public stories$ = this._stories$.asObservable();

  constructor() { }
  storageService = inject(StorageService);
  userService = inject(UserService);
  http = inject(HttpClient);

  public async loadStories(userId: number) {
    let options = { params: {} }
    if (userId) {
      options.params = {
        userId
      }
    }

    const stories = await firstValueFrom(
      this.http.get<Story[]>('http://localhost:3030/api/story', options),
    )

    this._stories$.next(stories);
    // this._stories$.next([]);
  }

  public getById(storyId: number): Observable<Story> {
    // return from(asyncStorageService.get(ENTITY, storyId) as Promise<Story>);
    return this.http.get<Story>(`http://localhost:3030/api/story/${storyId}`)
  }

  public remove(storyId: number): Observable<boolean> {
    // return from(asyncStorageService.remove(ENTITY, storyId));
    return this.http.delete<boolean>(`http://localhost:3030/api/story/${storyId}`)
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
      this.http.post('http://localhost:3030/api/story', story),
    ) as { msg: string, id: number }

    if (res.msg === 'Story added') {
      const stories = this._stories$.getValue()
      story.id = res.id
      stories.unshift(story)
      this._stories$.next(stories)

      return res.id
    }
  }

  private async _update(story: Story): Promise<void> {
    await firstValueFrom(
      this.http.put(`http://localhost:3030/api/story/${story.id}`, story),
    )
  }


  public getEmptyStory(): Story {
    return {
      id: 0,
      imgUrls: [],
      by: this.userService.getEmptyMiniUser(),
      watchedBy: [],
      createdAt: new Date()
    }
  }


}
