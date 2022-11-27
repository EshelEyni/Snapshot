import { PostService } from 'src/app/services/post.service';
import { LoadLoggedInUser, SaveUser } from './../../store/actions/user.actions';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { faHeart, faComment, faPaperPlane, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { State } from 'src/app/store/store';

@Component({
  selector: 'post-actions',
  templateUrl: './post-actions.component.html',
  styleUrls: ['./post-actions.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['post']
})
export class PostActionsComponent implements OnInit {

  constructor(
    private userService: UserService,
    private postService: PostService,
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  }

  post!: Post;
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;

  // Icons
  faHeart = faHeart;
  faHeartSolid = faHeartSolid;
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faBookmark = faBookmark;
  faBookmarkSolid = faBookmarkSolid;

  isLiked: boolean = false;
  isSaved: boolean = false;

  isShareModalShown: boolean = false;

  ngOnInit() {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) this.loggedinUser = JSON.parse(JSON.stringify(user));
    })

    setTimeout(() => {
      this.setPostProporties();
    }, 1000);
  }

  setPostProporties() {
    this.isLiked = this.post.likedBy.some(user => user.id === this.loggedinUser.id)
    this.isSaved = this.loggedinUser.savedPostsIds.some(postId => postId === this.post.id)
  }

  onToggleLike() {

    if (this.isLiked) {
      this.post.likedBy = this.post.likedBy.filter(user => user.id !== this.loggedinUser.id);
    } else {
      const { id, username, fullname, imgUrl } = this.loggedinUser;
      this.post.likedBy.push({ id, username, fullname, imgUrl });
    }

    this.postService.save(this.post);
    this.isLiked = !this.isLiked;
  }

  onToggleSave() {
    if (this.isSaved) {
      this.loggedinUser.savedPostsIds = this.loggedinUser.savedPostsIds.filter(postId => postId !== this.post.id);
    } else {
      this.loggedinUser.savedPostsIds.push(this.post.id);
    }

    this.store.dispatch(new SaveUser(this.loggedinUser));
    this.isSaved = !this.isSaved;
  }

  onToggleModal() {
    this.isShareModalShown = !this.isShareModalShown;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
