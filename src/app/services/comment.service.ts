import { Comment } from './../models/post.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor() { }

  getCommentsForPost(postId: string) { }

  getCommentsForPreview(postId: string) { 
    
  }

  addComment(commentTxt: string, comments: Comment[]) {
    const commentToAdd = {
      _id: 'asdaasd',
      by: { _id: 'asdasd', fullname: 'user', imgUrl: 'https://picsum.photos/200/300' },
      txt: '',
      at: new Date(),
      likedBy: []
    }
    commentToAdd.txt = commentTxt;
    comments.push(commentToAdd);
  }

  removeComment(commentId: string) { }

}
