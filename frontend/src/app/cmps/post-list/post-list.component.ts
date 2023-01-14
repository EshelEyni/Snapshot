import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  @Input() posts!: Post[]
  @Input() isMiniPreview!: boolean;
  @Input() isPostDetailsNestedRoute!: boolean;
  
  constructor() { }

  ngOnInit(): void {
  }

}
