import { HttpClient } from '@angular/common/http'
import { MiniUser } from './../models/user.model'
import { StorageService } from './storage.service'
import { Injectable } from '@angular/core'
import {
  Observable,
  BehaviorSubject,
  of,
  throwError,
  lastValueFrom,
  filter,
  firstValueFrom,
} from 'rxjs'
import { Post } from '../models/post.model'
import { asyncStorageService } from './async-storage.service'
import { UserService } from './user.service'
const POSTS = [
  {
    id: '1',
    imgUrls: [
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666643317/v67tpfibtyacwmhnujyz.jpg',
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664328667/hzazeapkfkxc76iwfuzi.webp',
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664790207/y8kaho2wmjhlyyiwuint.jpg',
    ],
    by: {
      id: 'a12F34b907',
      fullname: 'Tal Hemo',
      username: 'tale',
      imgUrl:
        'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg',
    },
    location: { lat: 32.0749831, lng: 34.9120554, name: 'Tel Aviv' },
    likedBy: [
      {
        id: '132',
        fullname: 'User 1',
        username: 'user_1',
        imgUrl:
          'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg',
      },
    ],
    commentsIds: ['1', '2', '3'],
    createdAt: new Date(2022, 10, 9, 22, 22, 59, 0),
    tags: ['tag1', 'tag2'],
  },
  {
    id: '2',
    imgUrls: [
      'https://www.gardeningknowhow.com/wp-content/uploads/2017/07/hardwood-tree.jpg',
    ],
    by: {
      id: 'a12F34b907',
      fullname: 'Tal Hemo',
      username: 'tale',
      imgUrl:
        'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg',
    },
    location: { lat: 32.0749831, lng: 34.9120554, name: 'Tel Aviv' },
    likedBy: [
      {
        id: '132',
        fullname: 'User 1',
        username: 'user_1',
        imgUrl:
          'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg',
      },
    ],
    commentsIds: ['1', '2', '3'],
    createdAt: new Date(),
    tags: ['tag1', 'tag2'],
  },
]

const ENTITY = 'post'

@Injectable({
  providedIn: 'root',
})
export class PostService {
  // private _postsDb: Post[] = POSTS

  private _posts$ = new BehaviorSubject<Post[]>([])
  public posts$ = this._posts$.asObservable()

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private http: HttpClient,
  ) {}

  public async loadPosts(filterBy?: { userId: string; type: string }) {
    // let posts = this.storageService.loadFromStorage(ENTITY) || null
    // if (!posts) {
    //   // posts = this._postsDb
    //   this.storageService.saveToStorage(ENTITY, posts)
    // }
    // if (filterBy) posts = await this._getFilteredPosts(posts, filterBy)
    let options = { params: {} }
    if (filterBy) {
      options.params = {
        userId: filterBy.userId,
        type: filterBy.type,
      }
    }
    const posts = await lastValueFrom(
      this.http.get<Post[]>('http://localhost:3030/api/post', options),
    )
    this._posts$.next(posts)
  }

  private async _getFilteredPosts(
    posts: Post[],
    filterBy: { userId: string; type: string },
  ): Promise<Post[]> {
    if (filterBy.type === 'createdPosts') {
      return posts.filter((post) => post.by.id === filterBy.userId)
    } else {
      const user = await lastValueFrom(
        this.userService.getById(filterBy.userId),
      )
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
        posts.forEach((post) => {
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

  public save(post: Post) {
    return firstValueFrom(
      this.http.post('http://localhost:3030/api/post', post),
    )
  }

  public async saveCommentToPost(postId: string, commentId: string) {
    const post = (await asyncStorageService.get(ENTITY, postId)) as Post
    if (post) {
      // post.commentsIds.push(commentId)
      asyncStorageService.put(ENTITY, post)
    }
  }

  public getEmptyPost(): Post {
    return {
      id: '',
      imgUrls: [],
      by: this.userService.getEmptyMiniUser(),
      location: { id: 0, lat: 0, lng: 0, name: '' },
      likeSum: 0,
      commentsSum: 0,
      createdAt: new Date(),
      tags: [],
    }
  }
}
