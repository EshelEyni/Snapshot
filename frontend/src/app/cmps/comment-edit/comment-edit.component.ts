import { Tag } from './../../models/tag.model';
import { TagService } from './../../services/tag.service';
import { Subscription } from 'rxjs'
import { PostService } from './../../services/post.service'
import { Post } from './../../models/post.model'
import { UserService } from './../../services/user.service'
import { CommentService } from 'src/app/services/comment.service'
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji'
import { Component, OnInit, inject, ViewChild, ElementRef, OnDestroy } from '@angular/core'
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss'],
  inputs: ['post'],
})

export class CommentEditComponent implements OnInit, OnDestroy {
  constructor() { }

  @ViewChild('commentInput', { static: true }) input!: ElementRef;

  // toggleModal = new EventEmitter<string>()

  userService = inject(UserService)
  commentService = inject(CommentService)
  postService = inject(PostService)
  tagService = inject(TagService)
  communicationService = inject(CommunicationService)

  faFaceSmile = faFaceSmile
  isEmojiPickerShown: boolean = false
  isMainScreen: boolean = false
  commentText: string = ''
  post!: Post

  sub: Subscription | null = null;

  ngOnInit(): void {
    this.sub = this.communicationService.focusEmitter.subscribe(() => {
      this.input.nativeElement.focus();
    })
  }

  onAddEmoji(emoji: Emoji) {
    if (typeof emoji.emoji !== 'string') this.commentText += emoji.emoji.native
    else this.commentText += emoji.emoji

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
    const tags = this.tagService.detectTags(commentToAdd.text)
    if (tags.length) tags.forEach(async (tageName) => {
      const tag = { name: tageName }
      const id = await this.tagService.save(tag as Tag)
      if (typeof id === 'number')
        await this.postService.addPostToTag(id, this.post.id)
    })
  }

  onToggleEmojiPicker() {
    this.isEmojiPickerShown = !this.isEmojiPickerShown
    this.isMainScreen = !this.isMainScreen
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
