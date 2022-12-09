import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'quick-reaction',
  templateUrl: './quick-reaction.component.html',
  styleUrls: ['./quick-reaction.component.scss'],
  outputs: ['reactionSubmit']
})
export class QuickReactionComponent implements OnInit {

  constructor() { }

  reactionSubmit = new EventEmitter<string>();
  reactions = ['😂', '😮', '😍', '😢', '👏', '🔥', '🎉', '💯']

  ngOnInit(): void {
  }

  onSubmit(reaction: string) {
    this.reactionSubmit.emit(reaction)
  }
}
