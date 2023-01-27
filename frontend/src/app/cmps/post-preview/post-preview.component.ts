import { UserService } from 'src/app/services/user.service'
import { State } from 'src/app/store/store'
import { Store } from '@ngrx/store'
import { User } from 'src/app/models/user.model'
import { Observable, Subscription, map } from 'rxjs'
import { Post } from './../../models/post.model'
import { Component, Input, OnInit, inject, OnDestroy } from '@angular/core'
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'
import { Comment } from 'src/app/models/comment.model'
import { CommentService } from 'src/app/services/comment.service'

@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss'],
  inputs: ['post', 'type', 'isPostDetailsNestedRoute']
})
export class PostPreviewComponent implements OnInit, OnDestroy {
  constructor(private store: Store<State>) {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser))
  }

  commentService = inject(CommentService);
  userService = inject(UserService);
  post!: Post;
  type!: string;
  isPostDetailsNestedRoute!: boolean;


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

  isPostOwnedByUser: boolean = false;
  miniPreviewPostDetailsLink: string = '';

  comments!: Comment[];

  ngOnInit(): void {
    console.log('post-preview type: ', this.type);
    this.sub = this.loggedinUser$.subscribe(async user => {
      if (user) {
        this.loggedinUser = { ...user }
        this.isPostOwnedByUser = this.loggedinUser.id === this.post.by.id

        this.comments = await this.commentService.loadComments(
          {
            postId: this.post.id,
            userId: this.loggedinUser.id,
            type: this.type === 'chat-post-preview' ? this.type : 'post-preview'
          }
        )
      }
    })

    this.miniPreviewPostDetailsLink = this.isPostDetailsNestedRoute ? `_/post/${this.post.id}` : `/post/${this.post.id}`
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

  onAddComment(comment: Comment) {
    this.comments = [comment, ...this.comments]
  }

  onToggleCommentDisplay() {
    this.isCommentShown = !this.isCommentShown
  }

  onToggleLikeDisplay() {
    this.isLikeShown = !this.isLikeShown
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}
