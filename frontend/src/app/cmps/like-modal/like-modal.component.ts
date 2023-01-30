import { PostService } from 'src/app/services/post.service';
import { MiniUser } from './../../models/user.model';
import { Post } from './../../models/post.model';
import { Component, OnInit, inject, EventEmitter } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'like-modal',
  templateUrl: './like-modal.component.html',
  styleUrls: ['./like-modal.component.scss'],
  inputs: ['post'],
  outputs: ['close']
})
export class LikeModalComponent implements OnInit {

  constructor() { };

  faX = faX;

  postService = inject(PostService);

  post!: Post;
  users!: MiniUser[];

  close = new EventEmitter();


  async ngOnInit(): Promise<void> {
    this.users = await this.postService.getUsersWhoLiked(this.post.id);
  };

  onCloseModal(): void {
    this.close.emit();
  };
};