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

  public loadComments(filterBy = { postId: '', userId: '', type: '' }): Observable<Comment[]> {
    console
    let options = { params: {} }
    if (filterBy) {
      options.params = {
        postId: filterBy.postId,
        userId: filterBy.userId,
        type: filterBy.type,
      }
    }
    return this.http.get<Comment[]>('http://localhost:3030/api/comment', options)
  }

  public getById(commentId: string): Observable<Comment> {
    return this.http.get<Comment>(`http://localhost:3030/api/comment/${commentId}`)
  }

  public remove(commentId: string) {
    return this.http.delete<Comment>(`http://localhost:3030/api/comment/${commentId}`)
  }

  public save(comment: Comment) {
    return comment.id ? this._update(comment) : this._add(comment)
  }

  private async _update(comment: Comment) {
    return await firstValueFrom(this.http.put<Comment>('http://localhost:3030/api/comment', comment))
  }

  private async _add(comment: Comment) {
    return await firstValueFrom(this.http.post<Comment>('http://localhost:3030/api/comment', comment))
  }

  public getEmptyComment(): Comment {
    return {
      id: '',
      postId: '',
      by: this.userSerivce.getEmptyMiniUser(),
      text: '',
      createdAt: new Date(),
      likedBy: []
    }
  }

}
