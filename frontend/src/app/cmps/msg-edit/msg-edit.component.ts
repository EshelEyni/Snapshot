import { Story } from './../../models/story.model';
import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faPaperPlane, faFaceSmile, faHeart } from '@fortawesome/free-regular-svg-icons';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';


@Component({
  selector: 'msg-edit',
  templateUrl: './msg-edit.component.html',
  styleUrls: ['./msg-edit.component.scss'],
  inputs: ['isStoryReply', 'story'],
})
export class MsgEditComponent implements OnInit {

  constructor() { }

  faPaperPlane = faPaperPlane;
  faHeart = faHeart;
  isStoryReply!: boolean;
  story!: Story;
  placeHolderStr = '';
  isQuickReactionShown = false;
  msgSent = false;
  isShareModalShown: boolean = false;
  isLiked: boolean = false;
  isEmojiPickerShown: boolean = false
  faFaceSmile = faFaceSmile
  isMainScreen: boolean = false;
  text: string = '';

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




  onSendMsg(msg: string) {
    console.log('msg:', msg);
  }
}
