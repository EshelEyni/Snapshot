import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import {
  Component,
  OnInit,
  EventEmitter,
  OnChanges,
  OnDestroy,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
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
    private communicationService: CommunicationService
  ) {}

  @ViewChildren('svgIcon') icons!: QueryList<SvgIconComponent>;

  type!: 'post-preview' | 'post-details';

  post!: Post;
  sub: Subscription | null = null;
  loggedinUser!: User;

  isLiked: boolean = false;
  isSaved: boolean = false;
  commentIconUnactiveMode: boolean = true;
  iconClicked: boolean = false;

  iconColor: string = 'var(--tertiary-color)';

  toggleModal = new EventEmitter();

  @HostListener('document:click', ['$event'])
  onBodyClick(): void {
    if (this.iconClicked) {
      this.commentIconUnactiveMode = false;
      this.iconClicked = false;
    } else {
      this.commentIconUnactiveMode = true;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.setIconColor();
    }, 0);
  }

  setIconColor(): void {
    this.iconColor = this.loggedinUser.isDarkMode
      ? 'var(--primary-color)'
      : 'var(--tertiary-color)';
    this.icons.forEach((icon) => {
      icon.svgStyle = { color: this.iconColor, fill: this.iconColor };
    });
  }

  async ngOnChanges(): Promise<void> {
    this.isLiked = this.post.isLiked;
    this.isSaved = this.post.isSaved;
    setTimeout(() => {
      this.setIconColor();
    }, 0);
  }

  onToggleLike(): void {
    this.postService.toggleLike(this.isLiked, this.post);
    this.isLiked = !this.isLiked;
    this.post.likeSum = this.isLiked
      ? this.post.likeSum + 1
      : this.post.likeSum - 1;
  }

  onToggleSave(): void {
    this.postService.toggleSave(
      this.isSaved,
      this.post.id,
      this.loggedinUser.id
    );
    this.isSaved = !this.isSaved;
  }

  onAddComment(): void {
    this.iconClicked = true;
    if (this.type === 'post-preview') {
      this.router.navigate([`_/post/${this.post.id}`]);
    } else if (this.type === 'post-details') {
      if (window.innerWidth < 770) {
        this.router.navigate([`/post/${this.post.id}`]);
      } else {
        this.communicationService.focusInput();
      }
    }
  }

  onToggleModal(): void {
    this.toggleModal.emit();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
