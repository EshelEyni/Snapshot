import { Post } from './../../models/post.model';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Component, Input, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { faHeart, faComment, faPaperPlane, faBookmark, faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faCircle, faBookmark as faBookmarkSolid, faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
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
  faCircle = faCircle;
  
  isEmojiPickerShown: boolean = false;
  isPostDetailsShown: boolean = false;
  isShareModalShown: boolean = false;
  isMainScreen = { isShown: false, isDark: false };
  isExpandTxt: boolean = false;
  commentTxt: string = '';
  isLiked: boolean = false;
  isSaved: boolean = false;

  user = { id: "user101", fullname: "Yael Cohen", username:'yael_c', imgUrl: "https://randomuser.me", savedPostsIds: [''] }

  ngOnInit(): void {
    this.isLiked = this.post.likedBy.some(user => user.id === this.user.id)
    this.isSaved = this.user.savedPostsIds.some(postId => postId === this.post.id)
  }

  onToggleLike() {
    if (this.isLiked) {
      this.post.likedBy = this.post.likedBy.filter(user => user.id !== this.user.id);
    } else {
      this.post.likedBy.push(this.user);
    }
    this.isLiked = !this.isLiked;
  }

  onToggleSave() {
    if (this.isSaved) {
      this.user.savedPostsIds = this.user.savedPostsIds.filter(postId => postId !== this.post.id);
    } else {
      this.user.savedPostsIds.push(this.post.id);
    }
    this.isSaved = !this.isSaved;
  }

  onToggleModal(el: string) {
    switch (el) {
      case 'txt':
        this.isExpandTxt = true;
        break;
      case 'share':
        this.isShareModalShown = !this.isShareModalShown;
        if (this.isMainScreen.isShown)
          this.isMainScreen = { isShown: false, isDark: false };
        this.isMainScreen = { isShown: true, isDark: true };
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
