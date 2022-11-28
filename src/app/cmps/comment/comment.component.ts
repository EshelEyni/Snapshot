import { Component, OnInit, Input } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment!: Comment;

  constructor() { }
  isExpandTxt: boolean = false;
  isLongTxt!: boolean;

  ngOnInit(): void {
    this.isLongTxt = this.comment.txt.length > 100;
  }

  onExpandTxt() {
    this.isLongTxt = true;
  }

}
