import { Post } from './../../models/post.model';
import { Observable } from 'rxjs';
import { PostService } from './../../services/post.service';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {

  constructor() { }
  postService = inject(PostService)
  posts$!: Observable<Post[]>;

  ngOnInit(): void {
    this.postService.loadPosts();
    this.posts$ = this.postService.posts$;
  }

}
