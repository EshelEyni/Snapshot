import { UserService } from 'src/app/services/user.service'
import { State } from 'src/app/store/store'
import { Store } from '@ngrx/store'
import { User } from 'src/app/models/user.model'
import { Observable, Subscription, map } from 'rxjs'
import { Post } from './../../models/post.model'
import { Component, Input, OnInit, inject, ViewChild, ElementRef, OnDestroy } from '@angular/core'

import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'
import { CommentService } from 'src/app/services/comment.service'
@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss'],
})
export class PostPreviewComponent implements OnInit, OnDestroy {
  constructor(private store: Store<State>) {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser))
  }

  commentService = inject(CommentService)
  userService = inject(UserService)
  @Input() post!: Post
  @Input() isMiniPreview!: boolean

  faFaceSmile = faFaceSmile;

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  sub: Subscription | null = null;

  isShareModalShown: boolean = false;
  isLikeModalShown: boolean = false;
  isOptionsModalShown: boolean = false;
  isMainScreen: boolean = false;

  isLikeShown: boolean = true;
  isCommentShown: boolean = true;

  commentTxt: string = '';

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) this.loggedinUser = JSON.parse(JSON.stringify(user))
    })

    this.isCommentShown = this.post.isCommentShown;
    this.isLikeShown = this.post.isLikeShown;
  }

  onToggleModal(el: string) {
    switch (el) {
      case 'share-modal':
        this.isShareModalShown = !this.isShareModalShown
        break
      case 'like-modal':
        this.isLikeModalShown = !this.isLikeModalShown
        break
      case 'post-options-modal':
        this.isOptionsModalShown = !this.isOptionsModalShown
        break
      case 'main-screen':
        if (this.isShareModalShown) this.isShareModalShown = !this.isShareModalShown
        if (this.isLikeModalShown) this.isLikeModalShown = !this.isLikeModalShown
        if (this.isOptionsModalShown) this.isOptionsModalShown = !this.isOptionsModalShown
        break
    }
    this.isMainScreen = !this.isMainScreen
  }

  onToggleCommentDisplay() {
    this.isCommentShown = !this.isCommentShown
  }

  onToggleLikeDisplay() {
    this.isLikeShown = !this.isLikeShown
  }

  addCommentToPost(commentIds: string[]) {
    // this.post.commentsIds = [...commentIds];
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}
