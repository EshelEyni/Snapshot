import { LoadLoggedInUser } from './../../store/actions/user.actions';
import { UserService } from './../../services/user.service'
import { PostService } from './../../services/post.service'
import { State } from './../../store/store'
import { Store } from '@ngrx/store'
import { User } from './../../models/user.model'
import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
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
    private $location: Location,
    private postService: PostService,
    private userService: UserService,
    private store: Store<State>,
  ) {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser))
  }

  post!: Post
  isHome: boolean = false
  paramsSubscription!: Subscription

  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  sub: Subscription | null = null
  isShareModalShown: boolean = false
  isMainScreen: boolean = false
  userPosts$!: Observable<Post[]>;
  isWideImg!: boolean;

  faChevronLeft = faChevronLeft;

  ngOnInit() {
    const loggedinUser = this.userService.getLoggedinUser()
    if (loggedinUser) {
      this.store.dispatch(new LoadLoggedInUser(loggedinUser.id));
    }

    this.paramsSubscription = this.route.data.subscribe( async (data) => {
      const post = data['post']
      const isHome = data['isHome']
      this.isHome = isHome
      if (post) {
        this.post = post
        await this.setIsWideImg(this.post.imgUrls[0])
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
      }
    })
  }

  async setIsWideImg(img: string) {
    const imgEl = new Image()
    imgEl.src = img
    imgEl.onload = () => {
      this.isWideImg = imgEl.width / imgEl.height > 1 ? true : false
    }
  }

  onToggleShareModal() {
    this.isShareModalShown = !this.isShareModalShown
    this.isMainScreen = true
  }

  onFirstLike() {
    // this.post.likedBy.push(this.userService.getMiniUser(this.loggedinUser));
    // this.post = { ...this.post }
    // this.postService.save(this.post)
    this.post.likeSum++
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
