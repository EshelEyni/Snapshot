import { HttpClient } from '@angular/common/http';
import { PostService } from 'src/app/services/post.service';
import { MiniUser } from './../models/user.model';
import { StorageService } from './storage.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from './util.service';
import { Comment } from './../models/comment.model';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom, firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class CommentService {

  constructor() { }

  utilService = inject(UtilService);
  userSerivce = inject(UserService);
  storageService = inject(StorageService);
  postService = inject(PostService);
  http = inject(HttpClient);

  public async loadComments(
    filterBy: {
      postId: number,
      userId: number | null
      , type: string
    }
  ) {
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

    return comments
  }

  public getById(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`http://localhost:3030/api/comment/${commentId}`)
  }

  public async remove(commentId: number): Promise<{ msg: string } | void> {
    const res = await firstValueFrom(
      this.http.delete(`http://localhost:3030/api/comment/${commentId}`)
    ) as { msg: string }

    return res
  }

  public save(comment: Comment): Promise<{ msg: string, id: number } | void> {
    return comment.id ? this._update(comment) : this._add(comment)
  }

  private async _update(comment: Comment): Promise<{ msg: string, id: number } | void> {
    const res = await firstValueFrom(
      this.http.put(`http://localhost:3030/api/comment/${comment.id}`, comment)
    ) as { msg: string, id: number }
    return res
  }

  private async _add(comment: Comment): Promise<{ msg: string, id: number } | void> {
    const res = await firstValueFrom(
      this.http.post('http://localhost:3030/api/comment', comment)
    ) as { msg: string, id: number }

    return res
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

  public async toggleLike(isLiked: boolean, details: { user: MiniUser, comment: Comment }) {

    if (isLiked) {
      await firstValueFrom(
        this.http.delete(`http://localhost:3030/api/like/comment`, {
          body: { userId: details.user.id, commentId: details.comment.id }
        }),
      )
    } else {
      await firstValueFrom(
        this.http.post(`http://localhost:3030/api/like/comment`,
          { user: details.user, comment: details.comment }),
      )
    }
  }
}
