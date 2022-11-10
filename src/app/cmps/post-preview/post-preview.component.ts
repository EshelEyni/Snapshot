import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Component, Input, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { Post, Comment } from 'src/app/models/post.model';
import { faHeart, faComment, faPaperPlane, faBookmark, faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faCircle } from '@fortawesome/free-solid-svg-icons';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})

export class PostPreviewComponent implements OnInit {

  constructor() { }

  commentService = inject(CommentService);
  @Input() post!: Post;
  @ViewChild('postTxt') postElement!: ElementRef;

  // Icons
  faHeart = faHeart;
  faHeartSolid = faHeartSolid;
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faBookmark = faBookmark;
  faFaceSmile = faFaceSmile;
  faCircle = faCircle;

  isEmojiPickerShown: boolean = false;
  isPostDetailsShown: boolean = false;
  // isShareModalShown: boolean = false;
  isShareModalShown: boolean = true;
  isShadowScreen = { isShown: true, isDark: true };
  isExpandTxt: boolean = false;
  commentTxt: string = '';
  isLiked: boolean = false;

  user = { _id: "user101", fullname: "Yael Cohen", imgUrl: "https://randomuser.me" }

  ngOnInit(): void {
    this.isLiked = this.post.likedBy.some(user => user._id === this.user._id)
    console.log('this.isShareModalShown', this.isShareModalShown);
    console.log('this.isPostDetailsShown', this.isPostDetailsShown);

  }

  onToggleLike() {
    if (this.isLiked) {
      this.post.likedBy = this.post.likedBy.filter(user => user._id !== this.user._id);
    } else {
      this.post.likedBy.push(this.user);
    }
    this.isLiked = !this.isLiked;
  }

  onToggleElement(el: string) {
    switch (el) {
      case 'txt':
        this.isExpandTxt = true;
        break;
      case 'share':
        this.isShareModalShown = !this.isShareModalShown;
        this.isShadowScreen = { isShown: true, isDark: true };
        if (this.isShadowScreen.isShown)
          this.isShadowScreen = { isShown: false, isDark: false };
        break;
      case 'emoji':
        this.isEmojiPickerShown = !this.isEmojiPickerShown;
        this.isShadowScreen = { isShown: true, isDark: false };
        break;
      case 'details':
        this.isPostDetailsShown = !this.isPostDetailsShown;
        this.isShadowScreen = { isShown: true, isDark: true };
        break;
      case 'shadow-screen':
        this.isEmojiPickerShown = false;
        this.isShareModalShown = false;
        this.isPostDetailsShown = false;
        this.isShadowScreen = { isShown: false, isDark: false };
        break;
    }
  }

  onAddComment() {
    this.commentService.addComment(this.commentTxt, this.post.comments);
    this.commentTxt = '';
  }

  onAddEmoji(emoji: Emoji) {
    if (typeof emoji.emoji !== 'string') {
      this.commentTxt += emoji.emoji.native;
    } else {
      this.commentTxt += emoji.emoji;
    }
  }

}
