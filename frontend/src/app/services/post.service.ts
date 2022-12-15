import { MiniUser } from './../models/user.model';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError, lastValueFrom, filter } from 'rxjs';
import { Post } from '../models/post.model';
import { asyncStorageService } from './async-storage.service';
import { UserService } from './user.service';
const POSTS = [
  {
    id: '1',
    imgUrls: [
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666643317/v67tpfibtyacwmhnujyz.jpg',
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664328667/hzazeapkfkxc76iwfuzi.webp',
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664790207/y8kaho2wmjhlyyiwuint.jpg'
    ],
    by: { id: 'a12F34b907', fullname: 'Tal Hemo', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
    location: { lat: 32.0749831, lng: 34.9120554, name: 'Tel Aviv' },
    likedBy: [{ id: '132', fullname: 'User 1', username: 'user_1', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' }],
    commentsIds: ['1', '2', '3'],
    createdAt: new Date(2022, 10, 9, 22, 22, 59, 0),
    tags: ['tag1', 'tag2']
  },
  {
    id: '2',
    imgUrls: ['https://www.gardeningknowhow.com/wp-content/uploads/2017/07/hardwood-tree.jpg'],
    by: { id: 'a12F34b907', fullname: 'Tal Hemo', username: 'tale', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
    location: { lat: 32.0749831, lng: 34.9120554, name: 'Tel Aviv' },
    likedBy: [{ id: '132', fullname: 'User 1', username: 'user_1', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' }],
    commentsIds: ['1', '2', '3'],
    createdAt: new Date(),
    tags: ['tag1', 'tag2']
  }
];

const ENTITY = 'post';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  private _postsDb: Post[] = POSTS;

  private _posts$ = new BehaviorSubject<Post[]>([]);
  public posts$ = this._posts$.asObservable();

  constructor(
    private storageService: StorageService,
    private userService: UserService
  ) { }

  public async loadPosts(filterBy?: { userId: string, type: string }) {
    let posts = this.storageService.loadFromStorage(ENTITY) || null
    if (!posts) {
      posts = this._postsDb;
      this.storageService.saveToStorage(ENTITY, posts)
    }
    if (filterBy) posts = await this._getFilteredPosts(posts, filterBy)
    this._posts$.next(posts.reverse());
  }

  private async _getFilteredPosts(posts: Post[], filterBy: { userId: string, type: string }): Promise<Post[]> {

    if (filterBy.type === 'createdPosts') {
      return posts.filter(post => post.by.id === filterBy.userId)
    } else {
      const user = await lastValueFrom(this.userService.getById(filterBy.userId))
      const _posts: Post[] = []
      // if (filterBy.type === 'savedPosts') {
      //   user.savedPostsIds.forEach(async postId => {
      //     const post = await asyncStorageService.get(ENTITY, postId) as Post
      //     _posts.push(post)
      //   })
      //   return _posts
      // }
      if (filterBy.type === 'taggedPosts') {
        const userName = user.username
        posts.forEach(post => {
          if (post.tags.includes('#' + userName)) _posts.push(post)
        })
        return _posts
      }
    }

    return []
  }

  public getById(postId: string): Observable<Post> {
    let posts = this.storageService.loadFromStorage(ENTITY)
    const post = posts.find((post: Post) => post.id === postId)
    return post ? of(post) : throwError(() => `Post id ${postId} not found!`)
  }

  public remove(postId: string) {
    let posts = this.storageService.loadFromStorage(ENTITY)
    posts = posts.filter((post: Post) => post.id !== postId)
    this._posts$.next([...posts])
    this.storageService.saveToStorage(ENTITY, posts)
  }

  public save(post: Post, userId?: string,) {
    return post.id ? this._update(post) : this._add(post, userId || '')
  }

  private async _update(post: Post) {
    await asyncStorageService.put(ENTITY, post) as Post
    this.loadPosts()
  }

  private async _add(post: Post, userId: string) {
    const addedPost = await asyncStorageService.post(ENTITY, post) as Post
    this.loadPosts()
    return addedPost.id
  }

  public async saveCommentToPost(postId: string, commentId: string) {
    const post = await asyncStorageService.get(ENTITY, postId) as Post
    if (post) {
      post.commentsIds.push(commentId)
      asyncStorageService.put(ENTITY, post)
    }
  }

  public getEmptyPost(): Post {
    return {
      id: '',
      imgUrls: [],
      by: this.userService.getEmptyMiniUser(),
      location: { lat: 0, lng: 0, name: '' },
      likedBy: [],
      commentsIds: [],
      createdAt: new Date(),
      tags: []
    }
  }

}
