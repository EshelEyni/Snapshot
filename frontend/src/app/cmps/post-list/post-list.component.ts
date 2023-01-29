import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  inputs: ['posts', 'type', 'isPostDetailsNestedRoute']
})
export class PostListComponent implements OnInit {

  posts!: Post[];
  type!: 'full-preview' | 'mini-preview';
  isPostDetailsNestedRoute!: boolean;

  constructor() { };

  ngOnInit(): void {  };

}
