import { User } from 'src/app/models/user.model';
import { CommentService } from 'src/app/services/comment.service';
import { Component, OnInit, inject, EventEmitter } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  inputs: ['comments', 'loggedinUser', 'type'],
  outputs: ['commentRemoved']
})

export class CommentListComponent implements OnInit {

  constructor() { };

  commentService = inject(CommentService);

  type!: 'post-preview' | 'post-details' | 'chat-post-preview';

  loggedinUser!: User;
  comments!: Comment[];

  commentRemoved = new EventEmitter<number>();

  ngOnInit(): void { };

  onRemoveComment(commentId: number): void {
    this.commentRemoved.emit(commentId);
  };
};