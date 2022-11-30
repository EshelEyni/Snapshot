import { UserService } from './../../services/user.service';
import { PostService } from './../../services/post.service';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { User } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable, map, lastValueFrom } from 'rxjs';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private store: Store<State>
  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map((x => x.loggedinUser)));
  }

  post!: Post
  paramsSubscription!: Subscription

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null;
  isShareModalShown: boolean = false;
  isMainScreen: boolean = false;
  userPosts: Post[] = []

  async ngOnInit() {
    this.paramsSubscription = this.route.data.subscribe(data => {
      const post = data['post']
      if (post) this.post = post
    })

    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user));
        this.getUserPosts()
      }
    })

  }

  onToggleShareModal() {
    this.isShareModalShown = !this.isShareModalShown;
    this.isMainScreen = true;
  }

  onFirstLike() {
    this.post.likedBy.push(this.userService.getMiniUser(this.loggedinUser));
    this.post = { ...this.post };
    this.postService.save(this.post);
  }

  addCommentToPost(commentIds: string[]) {
    this.post.commentsIds = [...commentIds];
  }

  getUserPosts() {
    this.loggedinUser.createdPostsIds.forEach(async postId => {
      const post = await lastValueFrom(this.postService.getById(postId))
      this.userPosts.push(post)
    })
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

}
