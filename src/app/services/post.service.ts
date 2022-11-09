import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { Post } from '../models/post.model';

const POSTS = [
  {
    _id: '1asdasd',
    txt: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. ',
    imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666643317/v67tpfibtyacwmhnujyz.jpg',
    by: { _id: '132', fullname: 'User 1', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
    location: { lat: 32.0749831, lng: 34.9120554, name: 'Tel Aviv' },
    likedBy: [{ _id: '132', fullname: 'User 1', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' }],
    comments: [
      {
        _id: '1',
        by: {
          _id: '132',
          fullname: 'User 1',
          imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg'
        },
        txt: 'Comment 1',
        at: new Date(),
        likedBy: []
      },
      {
        _id: '2',
        by: {
          _id: '132',
          fullname: 'User 1',
          imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg'
        },
        txt: 'Comment 2',
        at: new Date(),
        likedBy: []
      }],
    createdAt: new Date(),
    tags: ['tag1', 'tag2']
  },
  {
    _id: '2',
    txt: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. ',
    imgUrl: 'https://www.gardeningknowhow.com/wp-content/uploads/2017/07/hardwood-tree.jpg',
    by: { _id: '132', fullname: 'User 1', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' },
    location: { lat: 32.0749831, lng: 34.9120554, name: 'Tel Aviv' },
    likedBy: [{ _id: '132', fullname: 'User 1', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg' }],
    comments: [
      {
        _id: '1asdasd',
        by: {
          _id: '132',
          fullname: 'User 1',
          imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg'
        },
        txt: 'Comment 1',
        at: new Date(),
        likedBy: []
      },
      {
        _id: '2',
        by: {
          _id: '132',
          fullname: 'User 1',
          imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg'
        },
        txt: 'Comment 2',
        at: new Date(),
        likedBy: []
      }],
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
  constructor() { }

  public loadPosts(): void {
    this._posts$.next(this._postsDb);
  }
}
