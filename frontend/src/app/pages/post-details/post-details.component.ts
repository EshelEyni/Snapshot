import { LoadLoggedInUser } from './../../store/actions/user.actions';
import { UserService } from './../../services/user.service'
import { PostService } from './../../services/post.service'
import { State } from './../../store/store'
import { Store } from '@ngrx/store'
import { User } from './../../models/user.model'
import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription, Observable, map, lastValueFrom } from 'rxjs'
import { Post } from 'src/app/models/post.model'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

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
    private store: Store<State>,
  ) {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser))
  }

  post!: Post;
  isHome: boolean = false;
  paramsSubscription!: Subscription;

  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  sub: Subscription | null = null;
  isShareModalShown: boolean = false;
  isMainScreen: boolean = false;
  userPosts$!: Observable<Post[]>;
  classForPost = 'post';

  faChevronLeft = faChevronLeft;
  isOptionsModalShown: boolean = false;
  isPostOwnedByUser: boolean = false;



  ngOnInit() {
    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
    }

    this.paramsSubscription = this.route.data.subscribe(async (data) => {
      const post = data['post']
      const isHome = data['isHome']
      this.isHome = isHome
      if (post) {
        this.post = post
        await this.setPostClassName(this.post.imgUrls[0])
        const loggedinUser = this.userService.getLoggedinUser()
        if (loggedinUser) {

          this.postService.loadPosts(
            {
              userId: loggedinUser.id,
              type: 'createdPosts',
              limit: 6,
              currPostId: this.post.id
            }
          )
          this.userPosts$ = this.postService.posts$
        }

      }
    })

    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
        this.isPostOwnedByUser = this.loggedinUser.id === this.post.by.id

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
    if (this.isHome) {
      this.router.navigate(['/'])
    } else {
      this.onToggleModal('main-screen')
    }
  }

  onFirstLike() {
    this.postService.toggleLike(false, { postId: this.post.id, user: this.userService.getMiniUser(this.loggedinUser) })
    this.post.likeSum++
    this.post = { ...this.post }
    this.postService.save(this.post)
  }

  addCommentToPost(commentIds: string[]) {
    // this.post.commentsIds = [...commentIds];
  }

  onGoBack() {
    this.$location.back()
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
    this.paramsSubscription.unsubscribe()
  }
}
