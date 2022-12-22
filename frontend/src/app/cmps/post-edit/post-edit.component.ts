import { User } from 'src/app/models/user.model'
import { Observable, Subscription, map } from 'rxjs'
import { State } from './../../store/store'
import { Store } from '@ngrx/store'
import { CommentService } from 'src/app/services/comment.service'
import { UtilService } from './../../services/util.service'
import { PostService } from 'src/app/services/post.service'
import { UploadImgService } from './../../services/upload-img.service'
import { Component, OnInit, inject, Output, EventEmitter, OnDestroy, } from '@angular/core'
import { faX, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { UserService } from 'src/app/services/user.service'
import { Location } from 'src/app/models/post.model'

@Component({
  selector: 'post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss'],
})

export class PostEditComponent implements OnInit, OnDestroy {
  @Output() togglePostEdit = new EventEmitter<boolean>()

  constructor(private store: Store<State>) {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser))
  }

  uploadImgService = inject(UploadImgService)
  userService = inject(UserService)
  postService = inject(PostService)
  UtilService = inject(UtilService)
  commentService = inject(CommentService)

  // Icons
  faX = faX
  faArrowLeft = faArrowLeft

  sub: Subscription | null = null
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  currTitle: string = 'create new post'
  // imgUrls: string[] = [];
  imgUrls: string[] = [
    'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044177/ukfallhy757gdlswvfuj.jpg',
    'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669305397/p7o8v7gvoy3bgdcymu0d.jpg',
    'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044038/pxbi0wi3po7fiadwdcke.jpg',
  ]
  txt: string = ''
  location: Location = {
    id: 0,
    lat: 0,
    lng: 0,
    name: '',
  }

  isEditMode: boolean = false
  currEditModeSettings: string = 'filters'
  // currImg: string = this.imgUrls[0]

  ngOnInit() {
    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
      }
    })
  }

  onSaveFiles(imgUrls: string[]) {
    this.imgUrls = imgUrls
    this.isEditMode = true
  }

  onTogglePostEdit() {
    this.togglePostEdit.emit(false)
  }

  onGoBack() {
    this.isEditMode = false
    this.imgUrls = []
  }

  onShare() {
    this.savePost()
  }

  async savePost() {
    const postToSave = this.postService.getEmptyPost()
    const author = this.userService.getMiniUser(this.loggedinUser)
    postToSave.imgUrls = this.imgUrls
    postToSave.by = author
    postToSave.location = this.location


    if (this.txt) {
      const commentToAdd = this.commentService.getEmptyComment()
      commentToAdd.text = this.txt
      commentToAdd.by = author
      commentToAdd.isOriginalText = true
      await this.commentService.save(commentToAdd)
    }

    await this.postService.save(postToSave)
    this.onTogglePostEdit()
  }

  onToggleEditSettings(currSetting: string) {
    this.currEditModeSettings = currSetting
  }

  onChangePost(ev: { txt: string; location: string }) {
    this.txt = ev.txt
    this.location.name = ev.location
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}
