import { HttpClient } from '@angular/common/http';
import { PostService } from 'src/app/services/post.service';
import { MiniUser } from './../models/user.model';
import { StorageService } from './storage.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from './util.service';
import { Comment } from './../models/comment.model';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, lastValueFrom, firstValueFrom } from 'rxjs';


const ENTITY = 'comment';

@Injectable({
  providedIn: 'root'
})

export class CommentService {
  // private _commentsDb: Comment[] = COMMENTS;

  private _comments$ = new BehaviorSubject<Comment[]>([]);
  public comments$ = this._comments$.asObservable();


  constructor() { }

  utilService = inject(UtilService);
  userSerivce = inject(UserService);
  storageService = inject(StorageService);
  postService = inject(PostService);
  http = inject(HttpClient);

  public async loadComments(
    filterBy: {
      postId: number,
      userId: number
      , type: string
    }
  ) {
    console
    let options = { params: {} }
    if (filterBy) {
      options.params = {
        postId: filterBy.postId,
        userId: filterBy.userId,
        type: filterBy.type,
      }
    }
    const comments = await lastValueFrom(
      this.http.get<Comment[]>('http://localhost:3030/api/comment', options)
    )
    this._comments$.next(comments)
  }

  public getById(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`http://localhost:3030/api/comment/${commentId}`)
  }

  public async remove(commentId: number) {
    const res = await firstValueFrom(
      this.http.delete(`http://localhost:3030/api/comment/${commentId}`)
    ) as { msg: string }

    if (res.msg === 'Comment deleted') {
      const comments = this._comments$.getValue()
      const idx = comments.findIndex((comment) => comment.id === commentId)
      comments.splice(idx, 1)
      this._comments$.next(comments)
    }
  }

  public save(comment: Comment) {
    return comment.id ? this._update(comment) : this._add(comment)
  }

  private async _update(comment: Comment) {
    return await firstValueFrom(this.http.put<Comment>(`http://localhost:3030/api/comment/${comment.id}`, comment))
  }

  private async _add(comment: Comment) {
    return await firstValueFrom(this.http.post<Comment>('http://localhost:3030/api/comment', comment))
  }

  public getEmptyComment(): Comment {
    return {
      id: 0,
      postId: 0,
      by: this.userSerivce.getEmptyMiniUser(),
      text: '',
      createdAt: new Date(),
      isOriginalText: false,
      likeSum: 0,
    }
  }

  public async checkIsLiked(userId: number, commentId: number): Promise<boolean> {
    const options = {
      params: {
        userId,
        commentId,
      }
    }

    const isLiked = await firstValueFrom(
      this.http.get(`http://localhost:3030/api/like/comment`, options),
    ) as Array<any>

    return isLiked.length > 0
  }

  public async toggleLike(isLiked: boolean, details: { user: MiniUser, commentId: number }) {

    if (isLiked) {
      await firstValueFrom(
        this.http.delete(`http://localhost:3030/api/like/comment`, {
          body: { userId: details.user.id, commentId: details.commentId }
        }),
      )
    } else {
      await firstValueFrom(
        this.http.post(`http://localhost:3030/api/like/comment`, details),
      )
    }
  }
}
