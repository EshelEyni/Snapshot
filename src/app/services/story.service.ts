import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { Story } from './../models/story.model';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { asyncStorageService } from './async-storage.service';

const STORIES: Story[] = [
  // {
  //   id: '2133',
  //   imgUrls: [
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044396/uasgrj8qkl0r4lis1vg0.jpg',
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666728248/ihkoy8cj2zvaexpe4ocp.webp'
  //   ],
  //   by: { id: 'a12tgeko907', fullname: 'User 1', username: 'eshel', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669304308/lci872dhvwd0jeuzh3h8.png' },
  //   watchedBy: [],
  //   createdAt: new Date()
  // },
  {
    id: '2134',
    imgUrls: [
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664328667/hzazeapkfkxc76iwfuzi.webp',
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666849411/hhcawziwjfnxgjteqjpg.jpg'
    ],
    by: { id: 'a12F34b907', fullname: 'User 2', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
    watchedBy: [],
    createdAt: new Date()
  },
  // {
  //   id: '2135',
  //   imgUrls: [
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664739963/lwecphhaszjclgjtgfhc.png',
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666720964/world-wide-music_pljw3g.jpg'
  //   ],
  //   by: { id: 'a12F34b907', fullname: 'User 2', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
  //   watchedBy: [],
  //   createdAt: new Date()
  // },
  // {
  //   id: '21345',
  //   imgUrls: [
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664736208/ggppvq6yeozkc9dorcxc.jpg',
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666557252/slje8zj2tlsf6pnkqdfo.jpg'
  //   ],
  //   by: { id: 'a12F34b907', fullname: 'User 2', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
  //   watchedBy: [],
  //   createdAt: new Date()
  // },
  // {
  //   id: '21344',
  //   imgUrls: [
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1665011934/ir3ylouirefcvnkqfdi6.jpg',
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664734398/lxw7ddhskffigjodyyic.jpg'
  //   ],
  //   by: { id: 'a12F34b907', fullname: 'User 2', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
  //   watchedBy: [],
  //   createdAt: new Date()
  // },
  // {
  //   id: '21341',
  //   imgUrls: [
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666590625/trgnb0aijyl5bylkncpz.jpg',
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664387395/yaq22wwi3sfwybsmd9ze.jpg'
  //   ],
  //   by: { id: 'a12F34b907', fullname: 'User 2', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
  //   watchedBy: [],
  //   createdAt: new Date()
  // },
  // {
  //   id: '21342',
  //   imgUrls: [
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666643327/bj0eko7qjbct1hlmcmbu.jpg',
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664328265/ubgpmrhtkoi4syzj5w0r.jpg'
  //   ],
  //   by: { id: 'a12F34b907', fullname: 'User 2', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
  //   watchedBy: [],
  //   createdAt: new Date()
  // },
  // {
  //   id: '2134234',
  //   imgUrls: [
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666804398/uxtcgoqzgb3avrhasr7n.jpg',
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664393399/mbbchses49czonpezwcz.jpg'
  //   ],
  //   by: { id: 'a12F34b907', fullname: 'User 2', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
  //   watchedBy: [],
  //   createdAt: new Date()
  // },
  // {
  //   id: '2134rew',
  //   imgUrls: [
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666809112/lieljpzwvsa6kmz2jgpm.jpg',
  //     'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664734785/xo5pfeix8mxmfjxmzzkr.png'
  //   ],
  //   by: { id: 'a12F34b907', fullname: 'User 2', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
  //   watchedBy: [],
  //   createdAt: new Date()
  // },
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
  userService = inject(UserService);

  public async loadStories(userIds?: string[]) {
    let stories = await this.storageService.loadFromStorage(ENTITY) || null;
    if (!stories) {
      stories = this._storiesDb;
      const loggedinUser = this.userService.getLoggedinUser();
      if (loggedinUser && !stories.map((s: Story) => s.by.id).includes(loggedinUser.id))
        stories = [this.getEmptyStory(), ...stories]
      this.storageService.saveToStorage(ENTITY, stories);
    }
    if (userIds) stories = stories.filter((story: Story) => userIds.includes(story.by.id));

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
    this.loadStories();
    return from(prmSavedItem) as Observable<Story>;
  }

  public getEmptyStory(): Story {
    return {
      id: '',
      imgUrls: [],
      by: this.userService.getLoggedinUser() || this.userService.getEmptyMiniUser(),
      watchedBy: [],
      createdAt: new Date()
    }
  }


}
