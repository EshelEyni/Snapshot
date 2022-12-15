import { PostService } from 'src/app/services/post.service';
import { MiniUser } from './../models/user.model';
import { asyncStorageService } from './async-storage.service';
import { StorageService } from './storage.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from './util.service';
import { Comment } from './../models/comment.model';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, lastValueFrom } from 'rxjs';

const COMMENTS = [
  {
    id: '1',
    txt: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. ',
    createdAt: new Date(2022, 10, 9, 22, 22, 59, 0),
    by: { id: 'u101', fullname: 'Shlomi Alini', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1610000000/cbtrkoffzcqreo533m1a.jpg', username: 'shlomi' },
    likedBy: [],
  },
  {
    id: '2',
    txt: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. ',
    createdAt: new Date(2022, 10, 9, 22, 22, 59, 0),
    by: { id: 'u101', fullname: 'Shlomi Alini', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1610000000/cbtrkoffzcqreo533m1a.jpg', username: 'shlomi' },
    likedBy: [],
  },
  {
    id: '3',
    txt: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. ',
    createdAt: new Date(2022, 10, 9, 22, 22, 59, 0),
    by: { id: 'u101', fullname: 'Shlomi Alini', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1610000000/cbtrkoffzcqreo533m1a.jpg', username: 'shlomi' },
    likedBy: [],
  },

]
const ENTITY = 'comment';

@Injectable({
  providedIn: 'root'
})

export class CommentService {
  private _commentsDb: Comment[] = COMMENTS;

  private _comments$ = new BehaviorSubject<Comment[]>([]);
  public comments$ = this._comments$.asObservable();


  constructor() { }

  utilService = inject(UtilService);
  userSerivce = inject(UserService);
  storageService = inject(StorageService);
  postService = inject(PostService);

  public loadComments(): void {
    let comments = this.storageService.loadFromStorage(ENTITY) || null
    if (!comments) {
      comments = this._commentsDb;
      this.storageService.saveToStorage(ENTITY, comments)
    }
    this._comments$.next(comments.reverse());
  }

  public getById(commentId: string): Observable<Comment> {
    let comments = this.storageService.loadFromStorage(ENTITY)
    const comment = comments.find((comment: Comment) => comment.id === commentId)
    return comment ? of(comment) : throwError(() => `Post id ${commentId} not found!`)
  }

  public remove(commentId: string) {
    let comments = this.storageService.loadFromStorage(ENTITY)
    comments = comments.filter((comment: Comment) => comment.id !== commentId)
    this._comments$.next([...comments])
    this.storageService.saveToStorage(ENTITY, comments)
  }

  public save(comment: Comment) {
    return comment.id ? this._update(comment) : this._add(comment)
  }

  private async _update(comment: Comment) {
    await asyncStorageService.put(ENTITY, comment) as Comment
    this.loadComments()
  }

  private async _add(comment: Comment) {
    const addedComment = await asyncStorageService.post(ENTITY, comment) as Comment
    this.loadComments()
    return addedComment.id
  }

  public getEmptyComment(): Comment {
    return {
      id: '',
      by: this.userSerivce.getEmptyMiniUser(),
      txt: '',
      createdAt: new Date(),
      likedBy: []
    }
  }

  public getCommentsForPostPreview(commentsIds: string[], user: User): Observable<Comment[]> {
    const comments: Comment[] = []
    // const followingIds = user.following.map((user: MiniUser) => user.id)
    const followingIds = ['']
    commentsIds.forEach(async (commentId: string) => {
      const comment = await lastValueFrom(this.getById(commentId))
      if (comment.by.id === user.id || followingIds.includes(comment.by.id)) comments.push(comment)
    })
    return of(comments)
  }

  public getCommentsForPost(commentsIds: string[]): Observable<Comment[]> {
    const comments: Comment[] = []
    commentsIds.forEach(async (commentId: string) => {
      const comment = await lastValueFrom(this.getById(commentId))
      comments.push(comment)
    })
    return of(comments)
  }

}
