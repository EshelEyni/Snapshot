import { CommentService } from 'src/app/services/comment.service';
import { User } from './../../models/user.model';
import { Component, OnInit, Input, inject, EventEmitter } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  inputs: ['comment', 'type', 'loggedinUser'],
  outputs: ['commentRemoved']
})
export class CommentComponent implements OnInit {

  constructor() { }

  commentService = inject(CommentService);
  commentRemoved = new EventEmitter<number>();

  comment!: Comment;
  type!: string;

  isExpandTxt: boolean = false;
  isLongTxt!: boolean;
  isLiked: boolean = false;
  loggedinUser !: User;
  isUserComment: boolean = false;
  isCommentModalShown: boolean = false;

  async ngOnInit() {
    this.isLongTxt = this.comment.text.length > 100;
    this.isLiked = await this.commentService.checkIsLiked(this.loggedinUser.id, this.comment.id);
    this.isUserComment = this.loggedinUser.id === this.comment.by.id;
  }

  async onToggleLike() {
    this.commentService.toggleLike(this.isLiked, { user: this.loggedinUser, comment: this.comment });
    this.isLiked = !this.isLiked;
    this.comment.likeSum = this.isLiked ? this.comment.likeSum + 1 : this.comment.likeSum - 1;
    this.commentService.save(this.comment);
  }

  onToggleCommentModal() {
    this.isCommentModalShown = !this.isCommentModalShown;
  }

  async onRemoveComment() {
    console.log('onRemoveComment');
    const res = await this.commentService.remove(this.comment.id);
    if (res && res.msg === 'Comment deleted') {
      this.commentRemoved.emit(this.comment.id);
    }
    this.onToggleCommentModal();
  }

  onExpandTxt() {
    this.isExpandTxt = true;
  }
}
