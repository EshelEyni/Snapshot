import { Story } from './../../models/story.model';
import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faPaperPlane, } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'msg-edit',
  templateUrl: './msg-edit.component.html',
  styleUrls: ['./msg-edit.component.scss'],
  inputs: ['isStoryReply', 'story'],
})
export class MsgEditComponent implements OnInit {

  constructor() { }

  faPaperPlane = faPaperPlane;
  isStoryReply!: boolean;
  story!: Story;
  placeHolderStr = '';
  isQuickReactionShown = false;
  msgSent = false;
  isShareModalShown: boolean = false;
  isLiked: boolean = false;
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
    if (this.isLiked) this.onSendMsg('👍')
  }

  onSubmit(form: NgForm) {
    console.log('form.value:', form.value);
    this.onSendMsg(form.value.msg)
    form.reset()
  }

  onSendMsg(msg: string) {
    console.log('msg:', msg);
  }
}
