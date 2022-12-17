import { lastValueFrom } from 'rxjs'
import { PostService } from './../../services/post.service'
import { Post } from './../../models/post.model'
import { UserService } from './../../services/user.service'
import { CommentService } from 'src/app/services/comment.service'
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji'
import { Component, EventEmitter, OnInit, inject } from '@angular/core'
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'

@Component({
  selector: 'comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss'],
  inputs: ['post'],
  outputs: ['addedComment'],
})
export class CommentEditComponent implements OnInit {
  constructor() {}
  toggleModal = new EventEmitter<string>()
  userService = inject(UserService)
  commentService = inject(CommentService)
  postService = inject(PostService)

  faFaceSmile = faFaceSmile
  isEmojiPickerShown: boolean = false
  isMainScreen: boolean = false
  commentText: string = ''
  post!: Post
  addedComment = new EventEmitter<string[]>()

  ngOnInit(): void {}

  onAddEmoji(emoji: Emoji) {
    if (typeof emoji.emoji !== 'string') {
      this.commentText += emoji.emoji.native
    } else {
      this.commentText += emoji.emoji
    }
  }

  async onAddComment() {
    this.isEmojiPickerShown = false
    const user = this.userService.getLoggedinUser()
    const commentToAdd = this.commentService.getEmptyComment()
    commentToAdd.text = this.commentText
    this.commentText = ''
    if (user) commentToAdd.by = user
    commentToAdd.postId = this.post.id
    await this.commentService.save(commentToAdd)
    this.post.commentSum++
    await this.postService.save(this.post)
  }

  onToggleEmojiPicker() {
    this.isEmojiPickerShown = !this.isEmojiPickerShown
    this.isMainScreen = !this.isMainScreen
  }
}
