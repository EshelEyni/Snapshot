import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss']
})
export class EmojiPickerComponent implements OnInit {

  @Output() emojiClick = new EventEmitter<Emoji>()
  
  addEmoji(emoji: Emoji) {
    this.emojiClick.emit(emoji);
  }
  constructor() { }

  ngOnInit(): void { }
}
