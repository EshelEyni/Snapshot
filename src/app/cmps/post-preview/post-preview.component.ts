import { Post } from './../../models/post.model';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Component, Input, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { faHeart, faComment, faPaperPlane, faBookmark, faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { CommentService } from 'src/app/services/comment.service';
@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})

export class PostPreviewComponent implements OnInit {
  height: { [klass: string]: any; } | null | undefined;

  constructor() { }

  commentService = inject(CommentService);
  @Input() post!: Post;

  // Icons
  faHeart = faHeart;
  faHeartSolid = faHeartSolid;
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faBookmark = faBookmark;
  faBookmarkSolid = faBookmarkSolid;
  faFaceSmile = faFaceSmile;

  isEmojiPickerShown: boolean = false;
  isPostDetailsShown: boolean = false;
  isShareModalShown: boolean = false;
  isMainScreen = { isShown: false, isDark: false };
  isExpandTxt: boolean = false;
  commentTxt: string = '';

  user = { id: "user101", fullname: "Yael Cohen", username: 'yael_c', imgUrl: "https://randomuser.me", savedPostsIds: [''] }

  ngOnInit(): void { }

  onToggleModal(el: string) {
    switch (el) {
      case 'txt':
        this.isExpandTxt = true;
        break;
      case 'emoji':
        this.isEmojiPickerShown = !this.isEmojiPickerShown;
        this.isMainScreen = { isShown: true, isDark: false };
        break;
      case 'details':
        this.isPostDetailsShown = !this.isPostDetailsShown;
        this.isMainScreen = { isShown: true, isDark: true };
        break;
      case 'main-screen':
        this.isEmojiPickerShown = false;
        this.isShareModalShown = false;
        this.isPostDetailsShown = false;
        this.isMainScreen = { isShown: false, isDark: false };
        break;
    }
  }

  onAddComment() {
    this.commentService.addComment(this.commentTxt, this.post.commentsIds);
    this.commentTxt = '';
    this.isEmojiPickerShown = false;
  }

  onAddEmoji(emoji: Emoji) {
    if (typeof emoji.emoji !== 'string') {
      this.commentTxt += emoji.emoji.native;
    } else {
      this.commentTxt += emoji.emoji;
    }
  }

}
