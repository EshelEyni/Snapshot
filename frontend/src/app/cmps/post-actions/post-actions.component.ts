import { PostService } from 'src/app/services/post.service'
import { SaveUser } from './../../store/actions/user.actions'
import { Component, OnInit, EventEmitter, OnChanges, SimpleChanges, OnDestroy, } from '@angular/core'
import { Store } from '@ngrx/store'
import { map, Observable, Subscription } from 'rxjs'
import { Post } from 'src/app/models/post.model'
import { User } from 'src/app/models/user.model'
import { UserService } from 'src/app/services/user.service'
import { State } from 'src/app/store/store'

@Component({
  selector: 'post-actions',
  templateUrl: './post-actions.component.html',
  styleUrls: ['./post-actions.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['post', 'loggedinUser'],
  outputs: ['toggleModal'],
})
export class PostActionsComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    private postService: PostService,
    private userService: UserService,
    private store: Store<State>,
  ) { }

  post!: Post
  loggedinUser!: User
  sub: Subscription | null = null
  isLiked: boolean = false
  isSaved: boolean = false
  toggleModal = new EventEmitter()

  ngOnInit() {
  }

  async ngOnChanges(changes: SimpleChanges) {
    this.isLiked = await this.postService.checkIsLiked({ postId: this.post.id, userId: this.loggedinUser.id })
    this.isSaved = await this.postService.checkIsSaved({ postId: this.post.id, userId: this.loggedinUser.id })
  }

  onToggleLike() {
    this.postService.toggleLike({ postId: this.post.id, user: this.userService.getMiniUser(this.loggedinUser) })
    this.isLiked = !this.isLiked
    this.post.likeSum = this.isLiked ? this.post.likeSum + 1 : this.post.likeSum - 1;
    this.postService.save(this.post)
  }

  onToggleSave() {
    this.postService.toggleSave({ postId: this.post.id, userId: this.loggedinUser.id })
    this.isSaved = !this.isSaved
  }

  onToggleModal() {
    this.toggleModal.emit()
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}
