import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { faHeart, faComment, faPaperPlane, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})

export class PostPreviewComponent implements OnInit {

  @Input() post!: Post;
  constructor() { }

  faHeart = faHeart;
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faBookmark = faBookmark;
  faEllipsis = faEllipsis;

  ngOnInit(): void {
  }

}
