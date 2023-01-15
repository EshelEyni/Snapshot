import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service'
import { Component, OnInit, EventEmitter, OnChanges, OnDestroy, HostListener, QueryList, ViewChildren } from '@angular/core'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'
import { Post } from 'src/app/models/post.model'
import { User } from 'src/app/models/user.model'
import { UserService } from 'src/app/services/user.service'
import { State } from 'src/app/store/store'
import { CommunicationService } from 'src/app/services/communication.service';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'post-actions',
  templateUrl: './post-actions.component.html',
  styleUrls: ['./post-actions.component.scss'],
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

  @ViewChildren('svgIcon') icons!: QueryList<SvgIconComponent>;

  post!: Post;
  loggedinUser!: User;
  type!: string;
  sub: Subscription | null = null;
  isLiked: boolean = false;
  isSaved: boolean = false;
  commentIconUnactiveMode: boolean = true;
  iconClicked: boolean = false;
  toggleModal = new EventEmitter();
  iconColor: string = 'var(--tertiary-color)'

  @HostListener("document:click", ["$event"])
  onBodyClick() {
    if (this.iconClicked) {
      this.commentIconUnactiveMode = false;
      this.iconClicked = false;
    } else {
      this.commentIconUnactiveMode = true;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.setIconColor();
    }, 0)
  }

  setIconColor() {
    this.iconColor = this.loggedinUser.isDarkMode ? 'var(--primary-color)' : 'var(--tertiary-color)'
    this.icons.forEach(icon => {
      icon.svgStyle = { color: this.iconColor, fill: this.iconColor }
    })
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
      this.router.navigate([`_/post/${this.post.id}`])
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
