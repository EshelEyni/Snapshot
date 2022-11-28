import { UserService } from 'src/app/services/user.service';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, map } from 'rxjs';
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

  constructor(
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  }

  commentService = inject(CommentService);
  userService = inject(UserService);
  @Input() post!: Post;

  faFaceSmile = faFaceSmile;

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  isEmojiPickerShown: boolean = false;
  isPostDetailsShown: boolean = false;
  isShareModalShown: boolean = false;
  isMainScreen = { isShown: false, isDark: false };
  commentTxt: string = '';

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) this.loggedinUser = JSON.parse(JSON.stringify(user));
    })
  }

  onToggleModal(el: string) {
    switch (el) {
      case 'share':
        this.isShareModalShown = !this.isShareModalShown;
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
    const user = this.userService.getMiniUser(this.loggedinUser);
    const commentToAdd = this.commentService.getEmptyComment();
    commentToAdd.txt = this.commentTxt;
    commentToAdd.by = user;
    this.commentService.save(commentToAdd);
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

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
