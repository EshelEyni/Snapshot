import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'quick-reaction',
  templateUrl: './quick-reaction.component.html',
  styleUrls: ['./quick-reaction.component.scss'],
  outputs: ['reactionSubmit']
})
export class QuickReactionComponent implements OnInit {

  constructor() { };

  reactions: string[] = ['😂', '😮', '😍', '😢', '👏', '🔥', '🎉', '💯']

  reactionSubmit = new EventEmitter<string>();

  ngOnInit(): void { };

  onSubmit(reaction: string): void {
    this.reactionSubmit.emit(reaction);
  };
};