import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';
import { Post } from './../../models/post.model';
import { Component, OnInit, EventEmitter, inject } from '@angular/core';

@Component({
  selector: 'post-options-modal',
  templateUrl: './post-options-modal.component.html',
  styleUrls: ['./post-options-modal.component.scss'],
  inputs: ['post'],
  outputs: ['close', 'toggleCommentDisplay', 'toggleLikeDisplay'],
})
export class PostOptionsModalComponent implements OnInit {

  constructor() { }

  router = inject(Router);
  postService = inject(PostService);
  post!: Post;
  close = new EventEmitter();
  toggleCommentDisplay = new EventEmitter();
  toggleLikeDisplay = new EventEmitter();

  toggleCommentDisplayBtnTxt: string = 'Turn off commenting';
  toggleLikeDisplayBtnTxt: string = 'Hide like count';

  isConfirmDeleteMsgShown: boolean = false;
  
  ngOnInit(): void {
    this.toggleCommentDisplayBtnTxt = this.post.isCommentShown ? 'Turn off commenting' : 'Turn on commenting';
    this.toggleLikeDisplayBtnTxt = this.post.isLikeShown ? 'Hide like count' : 'Unhide like count';
  }

  onToggleConfirmDelete() {
    this.isConfirmDeleteMsgShown = !this.isConfirmDeleteMsgShown;
  }

  async onDeletePost() {
    await this.postService.remove(this.post.id);
    this.router.navigate(['']);
    this.close.emit();
  }

  async onToggleLikeDisplay() {
    this.post.isLikeShown = !this.post.isLikeShown;
    await this.postService.save(this.post);
    this.toggleLikeDisplay.emit();
    this.close.emit();
  }

  async onToggleCommentDisplay() {
    this.post.isCommentShown = !this.post.isCommentShown;
    await this.postService.save(this.post);
    this.toggleCommentDisplay.emit();
    this.close.emit();
  }

  onGoToPost() {
    this.router.navigate(['post', this.post.id]);
    this.close.emit();
  }

  onCopyLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link + 'post/' + this.post.id);
    this.close.emit();
  }

  onCloseModal() {
    this.close.emit();
  }

}
