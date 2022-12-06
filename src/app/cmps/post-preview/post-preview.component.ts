import { UserService } from 'src/app/services/user.service';
import { State } from 'src/app/store/store';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, map } from 'rxjs';
import { Post } from './../../models/post.model';
import { Component, Input, OnInit, inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { CommentService } from 'src/app/services/comment.service';
@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})

export class PostPreviewComponent implements OnInit,OnDestroy {

  constructor(
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  }

  commentService = inject(CommentService);
  userService = inject(UserService);
  @Input() post!: Post;
  @Input() isMiniPreview!: boolean;

  faFaceSmile = faFaceSmile;
  faComments = faComments;


  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  // isPostDetailsShown: boolean = false;
  isShareModalShown: boolean = false;
  isMainScreen: boolean = false;
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
        this.isMainScreen = true;
        break;
      // case 'details':
      // this.isPostDetailsShown = !this.isPostDetailsShown;
      // this.isMainScreen = true;
      // break;
      case 'main-screen':
        this.isShareModalShown = false;
        // this.isPostDetailsShown = false;
        this.isMainScreen = false;
        break;
    }
  }

  addCommentToPost(commentIds: string[]) {
    this.post.commentsIds = [...commentIds];
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
