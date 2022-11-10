import { Comment } from './../models/comment.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor() { }

  getCommentsForPost(postId: string) { }

  getCommentsForPreview(postId: string) { 
    
  }

  addComment(commentTxt: string, commentsIds: string[]) {
    const commentToAdd = {
      _id: 'asdaasd',
      by: { _id: 'asdasd', fullname: 'user', imgUrl: 'https://picsum.photos/200/300' },
      txt: '',
      at: new Date(),
      likedBy: []
    }
    commentToAdd.txt = commentTxt;
    commentsIds.push(commentToAdd._id);
  }

  removeComment(commentId: string) { }

}
