import { TagService } from './../../services/tag.service';
import { State } from './../../store/store';
import { UserService } from './../../services/user.service';
import { LoadLoggedInUser, LoadUsers } from './../../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { CommentService } from 'src/app/services/comment.service';
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
  constructor() { }

  postService = inject(PostService)
  commentService = inject(CommentService);
  userService = inject(UserService);
  tagService = inject(TagService);
  store = inject(Store<State>);


  posts$!: Observable<Post[]>;

  ngOnInit(): void {
    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));

    this.store.dispatch(new LoadUsers());
    this.postService.loadPosts();
    this.posts$ = this.postService.posts$;
    this.commentService.loadComments();
    this.tagService.loadTags();
  }

}
