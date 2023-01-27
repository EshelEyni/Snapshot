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
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'msg-edit',
  templateUrl: './msg-edit.component.html',
  styleUrls: ['./msg-edit.component.scss'],
  inputs: ['isStoryReply', 'story', 'currStoryImgIdx', 'loggedinUser', 'chat'],
  outputs: ['toggleStoryTimer', 'msgSent']
})
export class MsgEditComponent implements OnInit {

  constructor() { }
  chatService = inject(ChatService)
  messageService = inject(MessageService)
  userService = inject(UserService)

  toggleStoryTimer = new EventEmitter()
  msgSent = new EventEmitter()

  faPaperPlane = faPaperPlane;
  faHeart = faHeart;
  isStoryReply!: boolean;
  story!: Story;
  placeHolderStr = '';
  isQuickReactionShown = false;
  isShareModalShown: boolean = false;
  isLiked: boolean = false;
  isEmojiPickerShown: boolean = false
  faFaceSmile = faFaceSmile
  isMainScreenShown: boolean = false;
  text: string = '';
  loggedinUser!: User;
  chat!: Chat;
  currStoryImgIdx!: number;

  async ngOnInit() {
    this.placeHolderStr = this.isStoryReply ? `Reply to ${this.story.by.username}...` : 'Message...'

    if (this.isStoryReply) {
      this.chat = await this.chatService.loadPersonalChat(this.loggedinUser.id, this.story.by.id)
      console.log('this.chat', this.chat);
      if (!this.chat) {
        this.isLiked = false
      } else {
        this.isLiked = this.chat.messages.some(m => m.storyId === this.story.id && m.type === 'like')
      }
    }
  }

  onToggleModal(el: string) {
    console.log('el', el);
    switch (el) {
      case 'share-modal':
        this.isShareModalShown = !this.isShareModalShown;
        break;
      case 'quick-reaction':
        this.isQuickReactionShown = !this.isQuickReactionShown;
        break;
      case 'main-screen':
        if (this.isShareModalShown) this.isShareModalShown = !this.isShareModalShown;
        if (this.isQuickReactionShown) this.isQuickReactionShown = !this.isQuickReactionShown;
        break;
    }
    this.isMainScreenShown = !this.isMainScreenShown;
    this.toggleStoryTimer.emit();
  }

  onToggleLike() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) this.onSendMsg('', 'story-like')

  }

  onAddEmoji(emoji: Emoji) {
    if (typeof emoji.emoji !== 'string') this.text += emoji.emoji.native
    else this.text += emoji.emoji

  }

  onToggleEmojiPicker() {
    this.isEmojiPickerShown = !this.isEmojiPickerShown
    this.isMainScreenShown = !this.isMainScreenShown
  }

  async onSendMsg(text: string, type: string) {
    const msg = this.messageService.getEmptyMessage()
    msg.sender = this.userService.getMiniUser(this.loggedinUser)

    if (this.isStoryReply && !this.chat) {
      const chatToAdd = this.chatService.getEmptyChat(
        this.loggedinUser,
        [this.story.by]
      )

      const chatId = await this.chatService.addChat(chatToAdd)
      if (chatId) {
        chatToAdd.id = chatId
        this.chat = chatToAdd
      }
    }

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
      case 'quick-reaction':
        msg.type = 'quick-reaction'
        msg.imgUrl = this.story.imgUrls[this.currStoryImgIdx]
        msg.text = text
        break;
      case 'story-reply':
        msg.type = 'story-reply'
        msg.imgUrl = this.story.imgUrls[this.currStoryImgIdx]
        msg.text = text
        break;
      case 'story-like':
        msg.type = 'story-like'
        msg.text = ''
        msg.imgUrl = this.story.imgUrls[this.currStoryImgIdx]
        msg.storyId = this.story.id
        break;
      case 'like':
        msg.type = 'like'
        msg.text = ''
        break;
    }

    await this.messageService.addMessage(msg)

    if (this.isStoryReply) {
      if (this.isQuickReactionShown) this.onToggleModal('quick-reaction')
      this.msgSent.emit()
    }

    this.text = ''
  }

  onSendImg(imgUrls: string[]) {
    this.onSendMsg(imgUrls[0], 'img')
  }
}
