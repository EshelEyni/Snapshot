import { SocketService } from './../../services/socket.service';
import { Chat } from './../../models/chat.model';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { MessageService } from './../../services/message.service';
import { Story } from './../../models/story.model';
import { Component, OnInit, OnChanges, EventEmitter, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faPaperPlane, faFaceSmile, faHeart } from '@fortawesome/free-regular-svg-icons';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Message } from 'src/app/models/chat.model';


@Component({
  selector: 'msg-edit',
  templateUrl: './msg-edit.component.html',
  styleUrls: ['./msg-edit.component.scss'],
  inputs: ['isStoryReply', 'story', 'loggedinUser', 'chat'],
})
export class MsgEditComponent implements OnInit {

  constructor() { }

  messageService = inject(MessageService)
  userService = inject(UserService)

  faPaperPlane = faPaperPlane;
  faHeart = faHeart;
  isStoryReply!: boolean;
  story!: Story;
  placeHolderStr = '';
  isQuickReactionShown = false;
  // msgSent = false;
  isShareModalShown: boolean = false;
  isLiked: boolean = false;
  isEmojiPickerShown: boolean = false
  faFaceSmile = faFaceSmile
  isMainScreen: boolean = false;
  text: string = '';
  loggedinUser!: User;
  chat!: Chat;

  ngOnInit(): void {
    this.placeHolderStr = this.isStoryReply ? `Reply to ${this.story.by.username}...` : 'Message...'
  }

  onToggleQuickReaction() {
    this.isQuickReactionShown = !this.isQuickReactionShown;
  }

  onToggleModal() {
    this.isShareModalShown = !this.isShareModalShown;
  }

  onToggleLike() {
    this.isLiked = !this.isLiked;
    // if (this.isLiked) this.onSendMsg('👍')
  }

  onAddEmoji(emoji: Emoji) {
    if (typeof emoji.emoji !== 'string') this.text += emoji.emoji.native
    else this.text += emoji.emoji

  }

  onToggleEmojiPicker() {
    this.isEmojiPickerShown = !this.isEmojiPickerShown
    this.isMainScreen = !this.isMainScreen
  }

  async onSendMsg(text: string, type: string) {
    const msg = this.messageService.getEmptyMessage()
    msg.sender = this.userService.getMiniUser(this.loggedinUser)
    msg.chatId = this.chat.id

    switch (type) {
      case 'img':
        msg.type = 'img'
        msg.imgUrl = text
        break;
      case 'text':
        msg.type = 'text'
        msg.text = text
        break;
      case 'like':
        msg.type = 'like'
        msg.text = ''
        break;
    }

    await this.messageService.addMessage(msg)
    this.text = ''
  }

  onSendImg(imgUrls: string[]) {
    this.onSendMsg(imgUrls[0], 'img')
  }
}
