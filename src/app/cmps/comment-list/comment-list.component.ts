import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  constructor() { }

  @Input() comments!: Comment[];


  ngOnInit(): void {
  }

}
