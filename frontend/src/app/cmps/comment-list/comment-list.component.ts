import { User } from 'src/app/models/user.model';
import { CommentService } from 'src/app/services/comment.service';
import { Component, Input, OnInit, inject, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  inputs: ['postId', 'loggedinUser', 'type', 'commentSum']
})
export class CommentListComponent implements OnInit {
  constructor() { }

  commentService = inject(CommentService);

  postId!: number;
  loggedinUser!: User;
  type!: string;
  commentSum!: number;

  comments$!: Observable<Comment[]>;

  ngOnInit() {
    this.getComments();
  }

  async getComments() {
    if (this.type === 'post-preview') {
      this.commentService.loadComments(
        {
          postId: this.postId,
          userId: this.loggedinUser.id,
          type: 'post-preview'
        }
      )
      this.comments$ = this.commentService.commentsPostPreview$;
    } else {
      this.commentService.loadComments(
        {
          postId: this.postId,
          userId: this.loggedinUser.id,
          type: 'post-details'
        }
      )
      this.comments$ = this.commentService.comments$;
    }
  }

}