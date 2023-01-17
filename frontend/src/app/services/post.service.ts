import { HttpClient } from '@angular/common/http'
import { MiniUser } from './../models/user.model'
import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject, lastValueFrom, firstValueFrom } from 'rxjs'
import { Post } from '../models/post.model'
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private _posts$ = new BehaviorSubject<Post[]>([])
  public posts$ = this._posts$.asObservable()

  private _createdPosts$ = new BehaviorSubject<Post[]>([])
  public createdPosts$ = this._createdPosts$.asObservable()

  constructor(
    private userService: UserService,
    private http: HttpClient,
  ) { }

  public async loadPosts(
    filterBy: {
      userId: number,
      type: string,
      limit: number,
      currPostId?: number,
      username?: string,
    }
  ) {
    let options = { params: {} }

    options.params = {
      userId: filterBy.userId,
      type: filterBy.type,
      limit: filterBy.limit,
    }

    if (filterBy.currPostId) options.params = { ...options.params, currPostId: filterBy.currPostId }
    if (filterBy.username) options.params = { ...options.params, username: filterBy.username }

    const posts = await lastValueFrom(
      this.http.get<Post[]>('http://localhost:3030/api/post', options),
    )

    switch (filterBy.type) {
      case 'homepagePosts':
        this._posts$.next(posts)
        break
      case 'createdPosts':
        if (filterBy.currPostId) this._createdPosts$.next(posts)
        else this._posts$.next(posts)
        break
      case 'savedPosts':
        this._posts$.next(posts)
        break
      case 'taggedPosts':
        this._posts$.next(posts)
        break
      case 'explorePagePosts':
        this._posts$.next(posts)
        break
      default:
        break
    }

  }

  public getById(postId: string): Observable<Post> {
    return this.http.get<Post>(`http://localhost:3030/api/post/${postId}`)
  }

  public async remove(postId: number) {
    const res = await firstValueFrom(
      this.http.delete(`http://localhost:3030/api/post/${postId}`),
    ) as { msg: string }

    if (res.msg === 'Post deleted') {
      const posts = this._posts$.getValue()
      const idx = posts.findIndex((post) => post.id === postId)
      posts.splice(idx, 1)
      this._posts$.next(posts)
    }
  }

  public save(post: Post) {
    if (post.id) {
      return this._update(post)
    } else {
      return this._add(post)
    }
  }

  private async _add(post: Post): Promise<number | void> {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3030/api/post', post),
    ) as { msg: string, id: number }

    if (res.msg === 'Post added') {
      const posts = this._posts$.getValue()
      post.id = res.id
      posts.unshift(post)
      this._posts$.next(posts)

      return res.id
    }
  }

  private _update(post: Post) {
    return firstValueFrom(
      this.http.put(`http://localhost:3030/api/post/${post.id}`, post),
    )
  }

  public getEmptyPost(): Post {
    return {
      id: 0,
      imgUrls: [],
      by: this.userService.getEmptyMiniUser(),
      location: { id: 0, lat: 0, lng: 0, name: '' },
      isLikeShown: true,
      isCommentShown: true,
      likeSum: 0,
      commentSum: 0,
      createdAt: new Date(),
      tags: [],
    }
  }

  public async getUsersWhoLiked(postId: number): Promise<MiniUser[]> {
    const options = {
      params: {
        postId,
      }
    }

    const likes = await firstValueFrom(
      this.http.get<MiniUser[]>(`http://localhost:3030/api/like/post/`, options),
    )
    return likes
  }


  public async checkIsLiked(filterBy: { userId: number, postId: number }): Promise<boolean> {
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

  public async toggleLike(isLiked: boolean, details: { user: MiniUser, postId: number }) {

    if (isLiked) {
      await firstValueFrom(
        this.http.delete(`http://localhost:3030/api/like/post`, {
          body: { postId: details.postId, userId: details.user.id }
        }),
      )
    } else {
      await firstValueFrom(
        this.http.post(`http://localhost:3030/api/like/post`, details),
      )
    }
  }

  public async checkIsSaved(filterBy: { userId: number, postId: number }): Promise<boolean> {
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

  public async toggleSave(isSaved: boolean, filterBy: { userId: number, postId: number }) {

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

  public async addPostToTag(tagId: number, postId: number) {
    await firstValueFrom(
      this.http.post(`http://localhost:3030/api/post/tag/`, { tagId, postId }),
    )
  }

}