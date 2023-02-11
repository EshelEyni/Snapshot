import { FollowService } from './../../services/follow.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';
import { Post } from './../../models/post.model';
import { Component, OnInit, EventEmitter, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'post-options-modal',
  templateUrl: './post-options-modal.component.html',
  styleUrls: ['./post-options-modal.component.scss'],
  inputs: ['post', 'loggedinUser', 'isPostOwnedByUser'],
  outputs: ['close', 'toggleCommentDisplay', 'toggleLikeDisplay'],
})
export class PostOptionsModalComponent implements OnInit {
  constructor() {}

  router = inject(Router);
  postService = inject(PostService);
  followService = inject(FollowService);
  communicationService = inject(CommunicationService);

  post!: Post;
  loggedinUser!: User;

  toggleCommentDisplayBtnTxt: string = 'Turn off commenting';
  toggleLikeDisplayBtnTxt: string = 'Hide like count';

  isConfirmDeleteMsgShown: boolean = false;
  isPostOwnedByUser!: boolean;
  isFollowed: boolean = false;

  close = new EventEmitter();
  toggleCommentDisplay = new EventEmitter();
  toggleLikeDisplay = new EventEmitter();

  async ngOnInit(): Promise<void> {
    this.toggleCommentDisplayBtnTxt = this.post.isCommentShown
      ? 'Turn off commenting'
      : 'Turn on commenting';
    this.toggleLikeDisplayBtnTxt = this.post.isLikeShown
      ? 'Hide like count'
      : 'Unhide like count';
    if (!this.isPostOwnedByUser) {
      this.isFollowed = this.post.by.isFollowing;
    }
  }

  onToggleConfirmDelete(): void {
    this.isConfirmDeleteMsgShown = !this.isConfirmDeleteMsgShown;
  }

  async onDeletePost(): Promise<void> {
    await this.postService.remove(this.post.id);
    this.communicationService.setUserMsg('Post Deleted.');
    this.router.navigate(['']);
    this.close.emit();
  }

  async onUnfollowUser(): Promise<void> {
    await this.followService.toggleFollow(true, this.post.by);
    this.close.emit();
  }

  async onToggleLikeDisplay(): Promise<void> {
    this.post.isLikeShown = !this.post.isLikeShown;
    await this.postService.save(this.post);
    this.toggleLikeDisplay.emit();
    this.close.emit();
  }

  async onToggleCommentDisplay(): Promise<void> {
    this.post.isCommentShown = !this.post.isCommentShown;
    await this.postService.save(this.post);
    this.toggleCommentDisplay.emit();
    this.close.emit();
  }

  onGoToPost(): void {
    this.router.navigate(['post', this.post.id]);
    this.close.emit();
  }

  onCopyLink(): void {
    const link = window.location.href;
    navigator.clipboard.writeText(link + 'post/' + this.post.id);
    this.close.emit();
  }

  onCloseModal(): void {
    this.close.emit();
  }
}
