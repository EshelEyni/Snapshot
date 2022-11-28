import { lastValueFrom } from 'rxjs';
import { PostService } from './../../services/post.service';
import { Post } from './../../models/post.model';
import { UserService } from './../../services/user.service';
import { CommentService } from 'src/app/services/comment.service';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss'],
  inputs: ['post']
})

export class CommentEditComponent implements OnInit {

  constructor() { }
  toggleModal = new EventEmitter<string>();
  userService = inject(UserService);
  commentService = inject(CommentService);
  postService = inject(PostService);

  faFaceSmile = faFaceSmile;
  isEmojiPickerShown: boolean = false;
  isMainScreen: boolean = false;
  commentTxt: string = '';
  post!: Post;

  ngOnInit(): void {
  }

  onAddEmoji(emoji: Emoji) {
    if (typeof emoji.emoji !== 'string') {
      this.commentTxt += emoji.emoji.native;
    } else {
      this.commentTxt += emoji.emoji;
    }
  }

  async onAddComment() {
    this.isEmojiPickerShown = false;
    const user = this.userService.getLoggedinUser();
    const commentToAdd = this.commentService.getEmptyComment();
    commentToAdd.txt = this.commentTxt;
    this.commentTxt = '';
    if (user) commentToAdd.by = user;
    const commentId = await this.commentService.save(commentToAdd, this.post.id);
    if (commentId) this.post.commentsIds.push(commentId);
    this.postService.loadPosts();
  }

  onToggleEmojiPicker() {
    this.isEmojiPickerShown = !this.isEmojiPickerShown;
    this.isMainScreen = !this.isMainScreen;
  }

}
