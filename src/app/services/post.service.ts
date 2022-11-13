import { User } from './../models/user.model';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { Post } from '../models/post.model';

const POSTS = [
  {
    _id: '1asdasd',
    txt: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. ',
    imgUrls: [
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666643317/v67tpfibtyacwmhnujyz.jpg',
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664328667/hzazeapkfkxc76iwfuzi.webp',
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664790207/y8kaho2wmjhlyyiwuint.jpg'
    ],
    by: { _id: '132', fullname: 'User 1', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
    location: { lat: 32.0749831, lng: 34.9120554, name: 'Tel Aviv' },
    likedBy: [{ _id: '132', fullname: 'User 1', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' }],
    commentsIds: ['1asdasd', '2asdasd', '3asdasd'],
    createdAt: new Date(2022, 10, 9, 22, 22, 59, 0),
    tags: ['tag1', 'tag2']
  },
  {
    _id: '2',
    txt: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. ',
    imgUrls: ['https://www.gardeningknowhow.com/wp-content/uploads/2017/07/hardwood-tree.jpg'],
    by: { _id: '132', fullname: 'User 1', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
    location: { lat: 32.0749831, lng: 34.9120554, name: 'Tel Aviv' },
    likedBy: [{ _id: '132', fullname: 'User 1', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' }],
    commentsIds: ['123', '456'],
    createdAt: new Date(),
    tags: ['tag1', 'tag2']
  }
];

@Injectable({
  providedIn: 'root'
})

export class PostService {

  private _postsDb: Post[] = POSTS;

  private _posts$ = new BehaviorSubject<Post[]>([]);
  public posts$ = this._posts$.asObservable();

  constructor(private storageService: StorageService) { }

  public loadPosts(): void {
    let posts = this.storageService.loadFromStorage('post') || null
    if (!posts) {
      posts = this._postsDb;
      this.storageService.saveToStorage('post', posts)
    }
    this._posts$.next(posts);
  }

  public getById(postId: string): Observable<Post> {
    let posts = this.storageService.loadFromStorage('post')
    const post = posts.find((post: Post) => post._id === postId)
    return post ? of(post) : throwError(() => `Post id ${postId} not found!`)
  }

  public remove(postId: string) {
    let posts = this.storageService.loadFromStorage('post')
    posts = posts.filter((post: Post) => post._id !== postId)
    this._posts$.next([...posts])
    this.storageService.saveToStorage('post', posts)
  }

  public save(post: Post) {
    return post._id ? this._update(post) : this._add(post)
  }

  private _update(post: Post) {
    let posts = this.storageService.loadFromStorage('post')
    posts = posts.map((p: Post) => post._id === p._id ? post : p)
    this._posts$.next([...posts])
    this.storageService.saveToStorage('post', posts)
  }

  private _add(post: Post) {
  //   let posts = this.storageService.loadFromStorage('post')
  //   const newPost = 
  //   posts.unshift(newPost)
  //   this._posts$.next([...posts])
  //   this.storageService.saveToStorage('posts', posts)
  }
}
