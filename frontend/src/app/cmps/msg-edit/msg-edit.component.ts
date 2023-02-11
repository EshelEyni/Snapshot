import { Chat } from './../../models/chat.model';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { MessageService } from './../../services/message.service';
import { Story } from './../../models/story.model';
import {
  Component,
  OnInit,
  EventEmitter,
  inject,
  OnChanges,
} from '@angular/core';
import {
  faPaperPlane,
  faFaceSmile,
  faHeart,
} from '@fortawesome/free-regular-svg-icons';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChatService } from 'src/app/services/chat.service';
import { StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'msg-edit',
  templateUrl: './msg-edit.component.html',
  styleUrls: ['./msg-edit.component.scss'],
  inputs: ['isStoryReply', 'story', 'currStoryImgIdx', 'loggedinUser', 'chat'],
  outputs: ['toggleStoryTimer', 'msgSent'],
})
export class MsgEditComponent implements OnInit, OnChanges {
  constructor() {}

  chatService = inject(ChatService);
  messageService = inject(MessageService);
  userService = inject(UserService);
  storyService = inject(StoryService);

  faFaceSmile = faFaceSmile;
  faPaperPlane = faPaperPlane;
  faHeart = faHeart;

  story!: Story;
  loggedinUser!: User;

  chat!: Chat;
  chatId!: number;
  currStoryImgIdx!: number;

  placeHolderStr = '';
  text: string = '';

  isStoryReply!: boolean;
  isQuickReactionShown = false;
  isShareModalShown: boolean = false;
  isLiked: boolean = false;
  isEmojiPickerShown: boolean = false;
  isMainScreenShown: boolean = false;

  toggleStoryTimer = new EventEmitter();
  msgSent = new EventEmitter();

  async ngOnInit(): Promise<void> {
    this.placeHolderStr = this.isStoryReply
      ? `Reply to ${this.story.by.username}...`
      : 'Message...';
  }

  async ngOnChanges(): Promise<void> {
    if (this.isStoryReply) {
      this.chatId = await this.chatService.getPersonalChatId(this.story.by.id);
      this.isLiked = this.story.isLiked;
    } else {
      this.chatId = this.chat.id;
    }
  }

  onToggleModal(el: string): void {
    switch (el) {
      case 'share-modal':
        this.isShareModalShown = !this.isShareModalShown;
        break;
      case 'quick-reaction':
        this.isQuickReactionShown = !this.isQuickReactionShown;
        break;
      case 'main-screen':
        if (this.isShareModalShown)
          this.isShareModalShown = !this.isShareModalShown;
        if (this.isQuickReactionShown)
          this.isQuickReactionShown = !this.isQuickReactionShown;
        break;
    }
    this.isMainScreenShown = !this.isMainScreenShown;
    this.toggleStoryTimer.emit();
  }

  onToggleLike(): void {
    this.isLiked = !this.isLiked;
    if (this.isLiked) this.onSendMsg('', 'story-like');
    else {
      const story = { ...this.story, isLiked: false };
      this.storyService.save(story);
    }
  }

  onAddEmoji(emoji: Emoji): void {
    if (typeof emoji.emoji !== 'string') this.text += emoji.emoji.native;
    else this.text += emoji.emoji;
  }

  onToggleEmojiPicker(): void {
    this.isEmojiPickerShown = !this.isEmojiPickerShown;
    this.isMainScreenShown = !this.isMainScreenShown;
  }

  async onSendMsg(text: string, type: string): Promise<void> {
    const msg = this.messageService.getEmptyMessage();
    msg.sender = this.userService.getMiniUser(this.loggedinUser);

    if (this.isStoryReply && !this.chatId) {
      const chatToAdd = this.chatService.getEmptyChat(this.loggedinUser, [
        this.story.by,
      ]);

      const chatId = await this.chatService.addChat(chatToAdd);
      if (chatId) {
        this.chatId = chatId;
      }
    }

    msg.chatId = this.chatId;

    switch (type) {
      case 'img':
        msg.type = 'img';
        msg.imgUrl = text;
        break;
      case 'text':
        msg.type = 'text';
        msg.text = text;
        break;
      case 'quick-reaction':
        msg.type = 'quick-reaction';
        msg.imgUrl = this.story.imgUrls[this.currStoryImgIdx];
        msg.text = text;
        break;
      case 'story-reply':
        msg.type = 'story-reply';
        msg.imgUrl = this.story.imgUrls[this.currStoryImgIdx];
        msg.text = text;
        break;
      case 'story-like':
        msg.type = 'story-like';
        msg.text = '';
        msg.imgUrl = this.story.imgUrls[this.currStoryImgIdx];
        msg.storyId = this.story.id;
        break;
      case 'like':
        msg.type = 'like';
        msg.text = '';
        break;
    }

    await this.messageService.addMessage(msg);

    if (this.isStoryReply) {
      if (this.isQuickReactionShown) this.onToggleModal('quick-reaction');
      this.msgSent.emit();
    }

    this.text = '';
  }

  onSendImg(imgUrls: string[]): void {
    this.onSendMsg(imgUrls[0], 'img');
  }
}
