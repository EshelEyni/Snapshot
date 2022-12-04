import { StorageService } from './storage.service';
import { Story } from './../models/story.model';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { asyncStorageService } from './async-storage.service';

const STORIES: Story[] = [
  {
    id: '2133',
    imgUrls: [
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044396/uasgrj8qkl0r4lis1vg0.jpg',
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666728248/ihkoy8cj2zvaexpe4ocp.webp'
    ],
    by: { id: 'a12tgeko907', fullname: 'User 1', username: 'eshel', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669304308/lci872dhvwd0jeuzh3h8.png' }
  },
  {
    id: '2134',
    imgUrls: [
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666728248/ihkoy8cj2zvaexpe4ocp.webp',
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044396/uasgrj8qkl0r4lis1vg0.jpg'
    ],
    by: { id: 'a12F34b907', fullname: 'User 2', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' }
  },
]

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

  public async loadStories(userIds: string[]) {
    let stories = await this.storageService.loadFromStorage(ENTITY) || null;
    if (!stories) {
      stories = this._storiesDb;
      this.storageService.saveToStorage(ENTITY, stories);
    }
    stories = stories.filter((story: Story) => userIds.includes(story.by.id));
    this._stories$.next(stories);

  }

  public getById(storyId: string): Observable<Story> {
    return from(asyncStorageService.get(ENTITY, storyId) as Promise<Story>);
  }

  public remove(storyId: string): Observable<boolean> {
    return from(asyncStorageService.remove(ENTITY, storyId));
  }

  public save(story: Story): Observable<Story> {
    const method = story.id ? 'put' : 'post';
    const prmSavedItem = asyncStorageService[method](ENTITY, story);
    return from(prmSavedItem) as Observable<Story>;
  }


}
