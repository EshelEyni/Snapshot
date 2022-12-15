import { PostService } from 'src/app/services/post.service';
import { SaveUser } from './../../store/actions/user.actions';
import { Component, OnInit, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { faComment, faPaperPlane, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
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
  inputs: ['post', 'loggedinUser'],
  outputs: ['toggleModal']
})
export class PostActionsComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private postService: PostService,
    private userService: UserService,
    private store: Store<State>
  ) { }

  post!: Post;
  loggedinUser!: User
  sub: Subscription | null = null;
  isLiked: boolean = false;
  isSaved: boolean = false;
  toggleModal = new EventEmitter<string>();

  // Icons
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faBookmark = faBookmark;
  faBookmarkSolid = faBookmarkSolid;

  ngOnInit() {
    this.setPostProporties();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isLiked = this.post.likedBy.some(user => user.id === this.loggedinUser.id)
  }

  setPostProporties() {
    this.isLiked = this.post.likedBy.some(user => user.id === this.loggedinUser.id)
    // this.isSaved = this.loggedinUser.savedPostsIds.some(postId => postId === this.post.id)
  }

  onToggleLike() {

    if (this.isLiked) {
      this.post.likedBy = this.post.likedBy.filter(user => user.id !== this.loggedinUser.id);
    } else {
      this.post.likedBy.push(this.userService.getMiniUser(this.loggedinUser));
    }

    this.postService.save(this.post);
    this.isLiked = !this.isLiked;
  }

  onToggleSave() {
    if (this.isSaved) {
      // this.loggedinUser.savedPostsIds = this.loggedinUser.savedPostsIds.filter(postId => postId !== this.post.id);
    } else {
      // this.loggedinUser.savedPostsIds.push(this.post.id);
    }

    this.store.dispatch(new SaveUser(this.loggedinUser));
    this.isSaved = !this.isSaved;
  }

  onToggleModal() {
    this.toggleModal.emit('share');
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
