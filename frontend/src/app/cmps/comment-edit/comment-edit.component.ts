import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { Tag } from './../../models/tag.model';
import { TagService } from './../../services/tag.service';
import { Subscription } from 'rxjs';
import { PostService } from './../../services/post.service';
import { Post } from './../../models/post.model';
import { UserService } from './../../services/user.service';
import { CommentService } from 'src/app/services/comment.service';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {
  Component,
  OnInit,
  inject,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { CommunicationService } from 'src/app/services/communication.service';
import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss'],
  inputs: ['post', 'isPostDetails', 'loggedinUser'],
  outputs: ['commentAdded'],
})
export class CommentEditComponent implements OnInit, OnDestroy {
  constructor() {}

  @ViewChild('commentInput', { static: true }) commentInput!: ElementRef;

  userService = inject(UserService);
  commentService = inject(CommentService);
  postService = inject(PostService);
  tagService = inject(TagService);
  communicationService = inject(CommunicationService);
  router = inject(Router);

  faFaceSmile = faFaceSmile;

  sub: Subscription | null = null;
  loggedinUser!: User;
  post!: Post;

  commentText: string = '';

  isPostDetails!: boolean;
  isEmojiPickerShown: boolean = false;
  isMainScreen: boolean = false;

  commentAdded = new EventEmitter<Comment>();

  ngOnInit(): void {
    if (this.isPostDetails) {
      this.sub = this.communicationService.focusEmitter.subscribe(() => {
        this.commentInput.nativeElement.focus();
      });
    }
  }

  onAddEmoji(emoji: Emoji): void {
    if (typeof emoji.emoji !== 'string') this.commentText += emoji.emoji.native;
    else this.commentText += emoji.emoji;
  }

  async onAddComment(): Promise<void> {
    this.isEmojiPickerShown = false;
    const commentToAdd = this.commentService.getEmptyComment();
    commentToAdd.text = this.commentText;
    this.commentText = '';
    commentToAdd.by = this.userService.getMiniUser(this.loggedinUser);
    commentToAdd.postId = this.post.id;
    const res = await this.commentService.save(commentToAdd);
    if (res) {
      this.commentAdded.emit(res.savedComment);
    };

    // await this.postService.save(this.post);
    // const tags = this.tagService.detectTags(commentToAdd.text);
    // if (tags.length)
    //   tags.forEach(async (tageName) => {
    //     const tag = { name: tageName };
    //     const id = await this.tagService.save(tag as Tag);
    //     if (typeof id === 'number')
    //       await this.postService.addPostToTag(id, this.post.id);
    //   });
  }

  onToggleEmojiPicker(): void {
    this.isEmojiPickerShown = !this.isEmojiPickerShown;
    this.isMainScreen = !this.isMainScreen;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
