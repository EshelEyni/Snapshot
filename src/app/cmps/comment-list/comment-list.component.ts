import { User } from 'src/app/models/user.model';
import { CommentService } from 'src/app/services/comment.service';
import { Component, Input, OnInit, inject, OnChanges, SimpleChanges } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  constructor() { }

  commentService = inject(CommentService);

  @Input() commentsIds!: string[];
  @Input() isPostPreview!: boolean;
  @Input() loggedinUser!: User;

  comments: Comment[] = [];

  async ngOnInit() {
    console.log('this.commentsIds', this.commentsIds);
    if (this.isPostPreview) {
      const comments = await lastValueFrom(this.commentService.getCommentsForPostPreview(this.commentsIds, this.loggedinUser));
      this.comments = comments;
    } else {
      const comments = await lastValueFrom(this.commentService.getCommentsForPost(this.commentsIds));
      this.comments = comments;
    }
  }

}