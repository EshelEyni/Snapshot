import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post-app',
  templateUrl: './post-app.component.html',
  styleUrls: ['./post-app.component.scss']
})
export class PostAppComponent implements OnInit {

  postService = inject(PostService)

  constructor() { }

  posts$!: Observable<Post[]>;

  ngOnInit(): void {
    this.postService.loadPosts();
    this.posts$ = this.postService.posts$;
  }

}
