import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service'
import { SaveUser } from './../../store/actions/user.actions'
import { Component, OnInit, EventEmitter, OnChanges, SimpleChanges, OnDestroy, HostListener } from '@angular/core'
import { Store } from '@ngrx/store'
import { map, Observable, Subscription } from 'rxjs'
import { Post } from 'src/app/models/post.model'
import { User } from 'src/app/models/user.model'
import { UserService } from 'src/app/services/user.service'
import { State } from 'src/app/store/store'
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'post-actions',
  templateUrl: './post-actions.component.html',
  styleUrls: ['./post-actions.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['post', 'loggedinUser', 'type'],
  outputs: ['toggleModal'],
})
export class PostActionsComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    private postService: PostService,
    private userService: UserService,
    private router: Router,
    private communicationService: CommunicationService,
    private store: Store<State>,
  ) { }

  post!: Post;
  loggedinUser!: User;
  type!: string;
  sub: Subscription | null = null;
  isLiked: boolean = false;
  isSaved: boolean = false;
  commentIconDarkMode: boolean = true;
  iconClicked: boolean = false;
  toggleModal = new EventEmitter();


  @HostListener("document:click", ["$event"])
  onBodyClick() {
    if (this.iconClicked) {
      this.commentIconDarkMode = false;
      this.iconClicked = false;
    } else {
      this.commentIconDarkMode = true;
    }
  }

  ngOnInit() {
  }

  async ngOnChanges() {
    this.isLiked = await this.postService.checkIsLiked({ postId: this.post.id, userId: this.loggedinUser.id })
    this.isSaved = await this.postService.checkIsSaved({ postId: this.post.id, userId: this.loggedinUser.id })
  }

  onToggleLike() {
    this.postService.toggleLike(this.isLiked, { postId: this.post.id, user: this.userService.getMiniUser(this.loggedinUser) })
    this.isLiked = !this.isLiked
    this.post.likeSum = this.isLiked ? this.post.likeSum + 1 : this.post.likeSum - 1;
    this.postService.save(this.post)
  }

  onToggleSave() {
    this.postService.toggleSave(this.isSaved, { postId: this.post.id, userId: this.loggedinUser.id })
    this.isSaved = !this.isSaved
  }

  onAddComment() {
    this.iconClicked = true;
    if (this.type === 'post-preview') {
      this.router.navigate([`homepage/post/${this.post.id}`])
    } else if (this.type === 'post-details') {
      this.communicationService.focusInput()
    }
  }

  onToggleModal() {
    this.toggleModal.emit()
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}
