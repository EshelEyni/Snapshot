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

  constructor(
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


  public getById(postId: string): Observable<Post> {

    return this.http.get<Post>(`http://localhost:3030/api/post/${postId}`)
  }

  public async remove(postId: string) {
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

  private async _add(post: Post) {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3030/api/post', post),
    ) as { msg: string , id: string }

    if (res.msg === 'Post added') {
      const posts = this._posts$.getValue()
      post.id = res.id
      posts.unshift(post)
      this._posts$.next(posts)
    }
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
      isLikeShown: true,
      isCommentShown: true,
      likeSum: 0,
      commentSum: 0,
      createdAt: new Date(),
      tags: [],
    }
  }

  public async getUsersWhoLiked(postId: string): Promise<MiniUser[]> {
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

  public async toggleLike(isLiked: boolean, details: { user: MiniUser, postId: string }) {

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
