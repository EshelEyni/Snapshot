import { Component, Input, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { Post, Comment } from 'src/app/models/post.model';
import { faHeart, faComment, faPaperPlane, faBookmark, faFaceSmile, faFaceSmileBeam } from '@fortawesome/free-regular-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})

export class PostPreviewComponent implements OnInit {

  @Input() post!: Post;
  @ViewChild('postTxt') postElement!: ElementRef;

  commentService = inject(CommentService);

  constructor() { }

  // Icons
  faHeart = faHeart;
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faBookmark = faBookmark;
  faEllipsis = faEllipsis;
  faFaceSmile = faFaceSmile;

  isExpandTxt = false;
  commentTxt = '';

  ngOnInit(): void {
  }

  expandTxt() {
    this.isExpandTxt = true;
  }

  onAddComment() {
    this.commentService.addComment(this.commentTxt, this.post.comments);
    this.commentTxt = '';
  }

}
