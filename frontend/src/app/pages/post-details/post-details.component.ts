import { LoadUsers } from './../../store/actions/user.actions';
import { UserService } from './../../services/user.service'
import { PostService } from './../../services/post.service'
import { State } from './../../store/store'
import { Store } from '@ngrx/store'
import { User } from './../../models/user.model'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription, Observable, map } from 'rxjs'
import { Post } from 'src/app/models/post.model'
import { faChevronLeft, faX } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private $location: Location,
    private postService: PostService,
    private userService: UserService,
    private commentService: CommentService,
    private store: Store<State>,
  ) {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser))
  }

  post!: Post;
  isNested: boolean = false;
  isExplorePage: boolean = false;
  paramsSubscription!: Subscription;

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  sub: Subscription | null = null;
  isShareModalShown: boolean = false;
  isMainScreen: boolean = false;
  userPosts$!: Observable<Post[]>;
  posts$!: Observable<Post[]>;
  postsIds: number[] = [];
  classForPost = 'post';
  isUserReqDispatched: boolean = false;

  comments!: Comment[];

  faChevronLeft = faChevronLeft;
  isOptionsModalShown: boolean = false;
  isPostOwnedByUser: boolean = false;
  faX = faX;
  isPaginationBtnShown = { left: false, right: false };
  postsSub!: Subscription;
  currIdx: number = 0;

  ngOnInit() {

    this.paramsSubscription = this.route.data.subscribe(async data => {
      this.isExplorePage = data['isExplorePage']
      this.isNested = data['isNested']

      if (data['post']) {
        this.post = data['post']
        await this.setPostClassName(this.post.imgUrls[0])

        if (!this.comments) {
          this.comments = await this.commentService.loadComments(
            {
              postId: this.post.id,
              userId: null,
              type: 'post-details'
            }
          )
          console.log('this.comments', this.comments);
        }

        if (!this.isNested) {
          this.postService.loadPosts(
            {
              userId: this.post.by.id,
              type: 'createdPosts',
              limit: 6,
              currPostId: this.post.id
            }
          )
          this.userPosts$ = this.postService.createdPosts$
        }
        else {

          if (this.isExplorePage) {
            this.posts$ = this.postService.posts$
            this.postsSub = this.posts$.subscribe((posts) => {
              this.postsIds = posts.map((post) => post.id)
              this.setPaginationBtns()
            })
          }
        }

      }
    })

    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) {
        this.loggedinUser = { ...user };
        this.isPostOwnedByUser = this.loggedinUser.id === this.post.by.id

        if (this.isNested && this.loggedinUser && !this.isUserReqDispatched) {
          this.isUserReqDispatched = true;
          this.store.dispatch(new LoadUsers({
            userId: this.loggedinUser.id,
            type: 'suggested',
            limit: 5,
          }));
        }
      }
    })
  }

  async setPostClassName(img: string) {
    let isWideImg;
    const imgEl = new Image()
    imgEl.src = img
    imgEl.onload = () => {
      isWideImg = imgEl.width / imgEl.height > 1 ? true : false
      this.classForPost += isWideImg ? ' for-wide-img' : ' for-narrow-img'
    }
  }

  setPaginationBtns() {
    this.currIdx = this.postsIds.indexOf(this.post.id);
    if (this.currIdx === 0) this.isPaginationBtnShown.left = false;
    else this.isPaginationBtnShown.left = true;
    if (this.currIdx === this.postsIds.length - 1) this.isPaginationBtnShown.right = false;
    else this.isPaginationBtnShown.right = true;
  }

  onToggleModal(el: string) {
    switch (el) {
      case 'share-modal':
        this.isShareModalShown = !this.isShareModalShown
        break
      case 'post-options-modal':
        this.isOptionsModalShown = !this.isOptionsModalShown
        break
      case 'main-screen':
        if (this.isShareModalShown) this.isShareModalShown = !this.isShareModalShown
        if (this.isOptionsModalShown) this.isOptionsModalShown = !this.isOptionsModalShown
        break
    }
    this.isMainScreen = !this.isMainScreen
  }

  onClickMainScreen() {
    if (this.isNested) {
      if (this.isExplorePage) this.router.navigate(['/explore'])
      else {
        this.router.navigate(['/'])
      }
    } else {
      this.onToggleModal('main-screen')
    }
  }

  onFirstLike() {
    this.postService.toggleLike(false, { post: this.post, user: this.userService.getMiniUser(this.loggedinUser) })
    this.post.likeSum++
    this.post = { ...this.post }
    this.postService.save(this.post)
  }

  onAddComment(comment: Comment) {
    this.comments = [comment, ...this.comments]
  }

  onGoBack() {
    this.$location.back()
  }

  onChangePost(index: number) {
    this.currIdx = this.postsIds.indexOf(this.post.id);
    const newIdx = this.currIdx + index;
    this.router.navigate([`/explore/_/post/${this.postsIds[newIdx]}`])
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
    this.paramsSubscription.unsubscribe()
    this.postsSub?.unsubscribe()
  }
}
