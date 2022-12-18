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

const ENTITY = 'post'

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private _posts$ = new BehaviorSubject<Post[]>([])
  public posts$ = this._posts$.asObservable()

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private http: HttpClient,
  ) { }

  public async loadPosts(filterBy?: { userId: string; type: string }) {
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

    return this.http.get<Post>(`http://localhost:3030/api/post/${postId}`)
  }

  public remove(postId: string) {
    let posts = this.storageService.loadFromStorage(ENTITY)
    posts = posts.filter((post: Post) => post.id !== postId)
    this._posts$.next([...posts])
    this.storageService.saveToStorage(ENTITY, posts)
  }

  public save(post: Post) {
    console.log('post', post)
    if (post.id) {
      return this._update(post)
    } else {
      return this._add(post)
    }
  }

  private _add(post: Post) {
    return firstValueFrom(
      this.http.post('http://localhost:3030/api/post', post),
    )
  }

  private _update(post: Post) {
    return firstValueFrom(
      this.http.put(`http://localhost:3030/api/post/${post.id}`, post),
    )
  }

  public getEmptyPost(): Post {
    return {
      id: '',
      imgUrls: [],
      by: this.userService.getEmptyMiniUser(),
      location: { id: 0, lat: 0, lng: 0, name: '' },
      likeSum: 0,
      commentSum: 0,
      createdAt: new Date(),
      tags: [],
    }
  }

  public async checkIsLiked(filterBy: { userId: string, postId: string }): Promise<boolean> {
    const options = {
      params: {
        userId: filterBy.userId,
        postId: filterBy.postId,
      }
    }

    const isLiked = await firstValueFrom(
      this.http.get(`http://localhost:3030/api/like/post`, options),
    ) as Array<any>
    if (isLiked.length) return true
    return false
  }

  public async toggleLike(filterBy: { userId: string, postId: string }) {
    const isLiked = await this.checkIsLiked(filterBy)

    if (isLiked) {
      await firstValueFrom(
        this.http.delete(`http://localhost:3030/api/like/post`, { body: filterBy }),
      )
    } else {
      await firstValueFrom(
        this.http.post(`http://localhost:3030/api/like/post`, filterBy),
      )
    }
  }

  public async checkIsSaved(filterBy: { userId: string, postId: string }): Promise<boolean> {
    const options = {
      params: {
        userId: filterBy.userId,
        postId: filterBy.postId,
      }
    }

    const isSaved = await firstValueFrom(
      this.http.get(`http://localhost:3030/api/save-post`, options),
    ) as Array<any>
    if (isSaved.length) return true
    return false
  }

  public async toggleSave(filterBy: { userId: string, postId: string }) {
    const isSaved = await this.checkIsSaved(filterBy)

    if (isSaved) {
      await firstValueFrom(
        this.http.delete(`http://localhost:3030/api/save-post`, { body: filterBy }),
      )
    } else {
      await firstValueFrom(
        this.http.post(`http://localhost:3030/api/save-post`, filterBy),
      )
    }
  }

}
