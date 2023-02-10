import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { PostService } from 'src/app/services/post.service';
import { MiniUser } from './../models/user.model';
import { StorageService } from './storage.service';
import { UserService } from 'src/app/services/user.service';
import { Comment } from './../models/comment.model';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor() {}

  userSerivce = inject(UserService);
  storageService = inject(StorageService);
  postService = inject(PostService);
  http = inject(HttpClient);
  httpService = inject(HttpService);
  cookieService = inject(CookieService);

  baseUrl = this.httpService.getBaseUrl();

  public async remove(commentId: number): Promise<{ msg: string } | void> {
    const options = { withCredentials: true };
    const res = (await firstValueFrom(
      this.http.delete(`${this.baseUrl}/comment/${commentId}`, options)
    )) as unknown as { msg: string };

    return res;
  }

  public async save(comment: Comment): Promise<Comment | void> {
    const options = { withCredentials: true };
    const res = await firstValueFrom(
      this.http.post<Comment>(`${this.baseUrl}/comment`, comment, options)
    );

    return res;
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
      isLiked: false,
    };
  }

  public async toggleLike(isLiked: boolean, comment: Comment): Promise<void> {
    const options = { withCredentials: true };
    if (isLiked) {
      await firstValueFrom(
        this.http.delete(`${this.baseUrl}/like/comment/${comment.id}`, options)
      );
    } else {
      await firstValueFrom(
        this.http.post(`${this.baseUrl}/like/comment`, comment, options)
      );
    }
  }
}
