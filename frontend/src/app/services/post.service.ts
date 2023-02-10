import { HttpClient } from '@angular/common/http';
import { MiniUser } from './../models/user.model';
import { inject, Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  lastValueFrom,
  firstValueFrom,
} from 'rxjs';
import { Post, PostCanvasImg } from '../models/post.model';
import { UserService } from './user.service';
import { UploadImgService } from './upload-img.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private _posts$ = new BehaviorSubject<Post[]>([]);
  public posts$ = this._posts$.asObservable();

  private _createdPosts$ = new BehaviorSubject<Post[]>([]);
  public createdPosts$ = this._createdPosts$.asObservable();

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private uploadImgService: UploadImgService
  ) {}

  httpService = inject(HttpService);

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl();

  public async loadPosts(filterBy: {
    type: string;
    limit: number;
    userId?: number;
    currPostId?: number;
    tagName?: string;
    username?: string;
  }): Promise<void> {
    const options = { withCredentials: true, params: {} };

    options.params = {
      userId: filterBy.userId,
      type: filterBy.type,
      limit: filterBy.limit,
    };

    if (filterBy.currPostId)
      options.params = { ...options.params, currPostId: filterBy.currPostId };
    if (filterBy.username)
      options.params = { ...options.params, username: filterBy.username };
    if (filterBy.tagName)
      options.params = { ...options.params, tagName: filterBy.tagName };

    const posts = await lastValueFrom(
      this.http.get<Post[]>(`${this.baseUrl}/post`, options)
    );

    switch (filterBy.type) {
      case 'createdPosts':
        if (filterBy.currPostId) this._createdPosts$.next(posts);
        else this._posts$.next(posts);
        break;
      default:
        this._posts$.next(posts);
        break;
    }
  }

  public clearPosts(): void {
    this._posts$.next([]);
  }

  public getById(postId: number): Observable<Post> {
    const options = { withCredentials: true };
    return this.http.get<Post>(`${this.baseUrl}/post/${postId}`, options);
  }

  public async remove(postId: number): Promise<void> {
    const options = { withCredentials: true };
    const res = (await firstValueFrom(
      this.http.delete(`${this.baseUrl}/post/${postId}` as string, options)
    )) as { msg: string };

    if (res.msg === 'Post deleted') {
      const posts = this._posts$.getValue();
      const idx = posts.findIndex((post) => post.id === postId);
      posts.splice(idx, 1);
      this._posts$.next(posts);
    }
  }

  public save(post: Post): Promise<void> | Observable<Post> {
    if (post.id) {
      return this._update(post);
    } else {
      return this._add(post);
    }
  }

  private async _add(post: Post): Promise<void> {
    const options = { withCredentials: true };
    const res = (await firstValueFrom(
      this.http.post(`${this.baseUrl}/post`, post, options)
    )) as Post;

    if (res) {
      const posts = this._posts$.getValue();
      posts.unshift(res);
      this._posts$.next(posts);
    }
  }

  private _update(post: Post): Observable<Post> {
    const options = { withCredentials: true };
    return firstValueFrom(
      this.http.put(`${this.baseUrl}/post/${post.id}`, post, options)
    ) as unknown as Observable<Post>;
  }

  public getEmptyPost(): Post {
    return {
      id: 0,
      imgUrls: [],
      by: this.userService.getEmptyMiniUser(),
      location: { id: 0, lat: 0, lng: 0, name: '' },
      isLikeShown: true,
      isCommentShown: true,
      isLiked: false,
      isSaved: false,
      likeSum: 0,
      comments: [],
      createdAt: new Date(),
      tags: [],
    };
  }

  public async getUsersWhoLiked(postId: number): Promise<MiniUser[]> {
    const options = {
      withCredentials: true,
      params: {
        postId,
      },
    };

    const likes = await firstValueFrom(
      this.http.get<MiniUser[]>(`${this.baseUrl}/like/post/`, options)
    );
    return likes;
  }

  public async toggleLike(
    isLiked: boolean,
    details: { user: MiniUser; post: Post }
  ): Promise<void> {
    const options = { withCredentials: true };
    if (isLiked) {
      await firstValueFrom(
        this.http.delete(`${this.baseUrl}/like/post`, {
          ...options,
          body: { postId: details.post.id, userId: details.user.id },
        })
      );
    } else {
      await firstValueFrom(
        this.http.post(
          `${this.baseUrl}/like/post`,
          {
            post: details.post,
            user: details.user,
          },
          options
        )
      );
    }
  }

  public async toggleSave(
    isSaved: boolean,
    postId: number,
    userId: number
  ): Promise<void> {
    const options = { withCredentials: true };
    if (isSaved) {
      await firstValueFrom(
        this.http.delete(
          `${this.baseUrl}/save-post/${postId}/${userId}`,
          options
        )
      );
    } else {
      const body = { postId, userId };
      await firstValueFrom(
        this.http.post(`${this.baseUrl}/save-post`, body, options)
      );
    }
  }

  public async convertCanvasImgsToImgUrls(
    offScreenCanvas: HTMLCanvasElement,
    canvasImgs: PostCanvasImg[],
    postImgUrls: string[]
  ) {
    const offScreenCtx = offScreenCanvas.getContext('2d');
    if (!offScreenCtx) return;

    return new Promise<void>((resolve, reject) => {
      let completed = 0;
      canvasImgs.forEach((canvasImg) => {
        const img = new Image();
        img.src = canvasImg.url;
        img.crossOrigin = 'Anonymous';

        img.onload = async () => {
          const canvasSize = window.innerWidth > 1260 ? 830 : window.innerWidth;
          switch (canvasImg.aspectRatio) {
            case 'Original':
              offScreenCanvas.width = canvasSize;
              offScreenCanvas.height = canvasSize;
              break;
            case '1:1':
              offScreenCanvas.width = canvasSize;
              offScreenCanvas.height = canvasSize;
              break;
            case '4:5':
              offScreenCanvas.width = canvasSize * 0.8;
              offScreenCanvas.height = canvasSize;
              break;
            case '16:9':
              offScreenCanvas.width = canvasSize;
              offScreenCanvas.height = canvasSize * 0.5625;
              break;
            default:
              break;
          }

          if (canvasImg.zoom) {
            const width =
              offScreenCanvas.width +
              canvasImg.zoom * (offScreenCanvas.width / offScreenCanvas.height);
            const height = offScreenCanvas.height + canvasImg.zoom;
            const x = offScreenCanvas.width / 2 - width / 2;
            const y = offScreenCanvas.height / 2 - height / 2;
            canvasImg = { ...canvasImg, x, y, width, height };
          }

          switch (canvasImg.filter) {
            case 'clarendon':
              offScreenCtx.filter =
                'saturate(1.6) contrast(1.5) brightness(1.1)';
              break;
            case 'gingham':
              offScreenCtx.filter =
                'sepia(1) brightness(1.1) hue-rotate(50deg)';
              break;
            case 'moon':
              offScreenCtx.filter =
                'grayscale(1) brightness(0.9) contrast(1.1)';
              break;
            case 'lark':
              offScreenCtx.filter =
                'brightness(1.2) contrast(1.1) saturate(1.5)';
              break;
            case 'reyes':
              offScreenCtx.filter =
                'brightness(1.1) contrast(1.1) saturate(1.5)';
              break;
            case 'juno':
              offScreenCtx.filter =
                'brightness(1.1) contrast(1.1) saturate(1.3)';
              break;
            case 'slumber':
              offScreenCtx.filter =
                'brightness(0.9) contrast(1.1) saturate(1.3)';
              break;
            case 'crema':
              offScreenCtx.filter =
                'brightness(1.1) contrast(1.1) saturate(1.1)';
              break;
            case 'normal':
              offScreenCtx.filter = 'none';
              break;
            default:
              offScreenCtx.filter = 'none';
              break;
          }

          offScreenCtx.fillStyle = 'rgba(38, 38, 38)';
          offScreenCtx.fillRect(
            0,
            0,
            offScreenCanvas.width,
            offScreenCanvas.height
          );

          offScreenCtx.drawImage(
            img,
            canvasImg.x,
            canvasImg.y,
            canvasImg.width,
            canvasImg.height
          );
          const imgData = offScreenCanvas.toDataURL();
          const res = await this.uploadImgService.uploadImg(imgData);
          postImgUrls.push(res);
          completed += 1;
          if (completed === canvasImgs.length) {
            resolve();
          }
        };
      });
    });
  }
}
