import { User } from 'src/app/models/user.model';
import { CommentService } from 'src/app/services/comment.service';
import { Component, Input, OnInit, inject, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  inputs: ['comments', 'loggedinUser', 'type']
})
export class CommentListComponent implements OnInit {
  constructor() { }

  commentService = inject(CommentService);

  loggedinUser!: User;
  type!: string;
  comments!: Comment[];

  ngOnInit() {
  }

  onRemoveComment(commentId: number) {
    this.comments = this.comments.filter(c => c.id !== commentId);
  }
}