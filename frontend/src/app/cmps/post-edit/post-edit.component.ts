import { TagService } from './../../services/tag.service';
import { PostCanvasImg } from './../../models/post.model';
import { User } from 'src/app/models/user.model'
import { Observable, Subscription, map } from 'rxjs'
import { State } from './../../store/store'
import { Store } from '@ngrx/store'
import { CommentService } from 'src/app/services/comment.service'
import { UtilService } from './../../services/util.service'
import { PostService } from 'src/app/services/post.service'
import { UploadImgService } from './../../services/upload-img.service'
import { Component, OnInit, inject, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, } from '@angular/core'
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
  @ViewChild('offScreenCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

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
  tagService = inject(TagService)

  // Icons
  faX = faX
  faArrowLeft = faArrowLeft

  sub: Subscription | null = null
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  currTitle: string = 'create new post'
  postImgs: PostCanvasImg[] = [
    // {
    //   url: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044177/ukfallhy757gdlswvfuj.jpg',
    //   x: 0,
    //   y: 0,
    //   width: 830,
    //   height: 830,
    //   aspectRatio: 'Original',
    //   zoom: 0,
    //   filter: 'normal',
    // }
    // ,
    // 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669305397/p7o8v7gvoy3bgdcymu0d.jpg',
    // 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044038/pxbi0wi3po7fiadwdcke.jpg',
  ]
  txt: string = ''
  location: Location = {
    id: 0,
    lat: 0,
    lng: 0,
    name: '',
  }

  currEditMode: string = 'crop'
  btnTxt: string = 'next'
  currFilter!: string;

  ngOnInit() {
    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
      }
    })
  }

  onSaveFiles(imgUrls: string[]) {
    this.postImgs = imgUrls.map((url) => {
      return {
        url,
        x: 0,
        y: 0,
        width: 830,
        height: 830,
        aspectRatio: 'Original',
        zoom: 0,
        filter: 'normal',
      }
    })
    this.currEditMode = 'crop'
    this.currTitle = 'crop'
  }

  onTogglePostEdit() {
    this.togglePostEdit.emit(false)
  }

  onSetFilter(filter: string) {
    this.currFilter = filter
  }

  onGoBack() {
    this.postImgs = []
  }

  onNext() {
    if (this.currEditMode === 'crop') {
      this.currEditMode = 'filter'
      this.currTitle = 'edit'
    }
    else if (this.currEditMode === 'filter') {
      this.currEditMode = 'txt-location'
      this.btnTxt = 'share'
      this.currTitle = 'create new post'
    }
    else if (this.currEditMode === 'txt-location') this.savePost()
  }

  async savePost() {
    const postToSave = this.postService.getEmptyPost();
    const author = this.userService.getMiniUser(this.loggedinUser);
    await this.convertCanvasImgsToImgUrls(this.postImgs, postToSave.imgUrls);
    // postToSave.imgUrls = this.postImgs.map(img => img.url);
    postToSave.by = author;
    postToSave.location = this.location;
    postToSave.tags = this.tagService.detectTags(this.txt);
    if (this.txt) postToSave.commentSum = 1;
    const postId = await this.postService.save(postToSave);


    if (this.txt && typeof postId === 'number') {
      // this.tagService.detectTags(this.txt);
      const commentToAdd = this.commentService.getEmptyComment();
      commentToAdd.text = this.txt;
      commentToAdd.by = author;
      commentToAdd.postId = postId;
      commentToAdd.isOriginalText = true;
      await this.commentService.save(commentToAdd);
    }

    this.onTogglePostEdit()
  }

  async convertCanvasImgsToImgUrls(canvasImgs: PostCanvasImg[], postImgUrls: string[]) {

    const offScreenCanvas = this.canvasRef.nativeElement;
    const offScreenCtx = offScreenCanvas.getContext('2d');
    if (!offScreenCtx) return

    return new Promise<void>((resolve, reject) => {
      let completed = 0;
      canvasImgs.forEach(canvasImg => {
        const img = new Image()
        img.src = canvasImg.url
        img.crossOrigin = "Anonymous";

        img.onload = async () => {

          switch (canvasImg.aspectRatio) {
            case 'Original':
              offScreenCanvas.width = 830;
              offScreenCanvas.height = 830;
              break;
            case '1:1':
              offScreenCanvas.width = 830;
              offScreenCanvas.height = 830;
              break;
            case '4:5':
              offScreenCanvas.width = 664;
              offScreenCanvas.height = 830;
              break;
            case '16:9':
              offScreenCanvas.width = 830;
              offScreenCanvas.height = 467;
              break;
            default:
              break;
          }

          if (canvasImg.zoom) {
            const width = offScreenCanvas.width + (canvasImg.zoom * (offScreenCanvas.width / offScreenCanvas.height))
            const height = offScreenCanvas.height + canvasImg.zoom
            const x = offScreenCanvas.width / 2 - width / 2
            const y = offScreenCanvas.height / 2 - height / 2
            canvasImg = { ...canvasImg, x, y, width, height }
          }

          switch (canvasImg.filter) {
            case 'clarendon':
              offScreenCtx.filter = 'saturate(1.6) contrast(1.5) brightness(1.1)';
              break;
            case 'gingham':
              offScreenCtx.filter = 'sepia(1) brightness(1.1) hue-rotate(50deg)';
              break;
            case 'moon':
              offScreenCtx.filter = 'grayscale(1) brightness(0.9) contrast(1.1)';
              break;
            case 'lark':
              offScreenCtx.filter = 'brightness(1.2) contrast(1.1) saturate(1.5)';
              break;
            case 'reyes':
              offScreenCtx.filter = 'brightness(1.1) contrast(1.1) saturate(1.5)';
              break;
            case 'juno':
              offScreenCtx.filter = 'brightness(1.1) contrast(1.1) saturate(1.3)';
              break;
            case 'slumber':
              offScreenCtx.filter = 'brightness(0.9) contrast(1.1) saturate(1.3)';
              break;
            case 'crema':
              offScreenCtx.filter = 'brightness(1.1) contrast(1.1) saturate(1.1)';
              break;
            case 'normal':
              offScreenCtx.filter = 'none';
              break;
            default:
              offScreenCtx.filter = 'none';
              break;
          }

          offScreenCtx.drawImage(
            img,
            canvasImg.x,
            canvasImg.y,
            canvasImg.width,
            canvasImg.height
          )
          const imgData = offScreenCanvas.toDataURL();
          const res = await this.uploadImgService.uploadImg(imgData);
          postImgUrls.push(res)
          completed += 1;
          if (completed === canvasImgs.length) {
            resolve();
          }
        }
      })
    });
  }

  onToggleEditSettings(currSetting: string) {
    this.currEditMode = currSetting
  }

  onChangePost(ev: { txt: string; location: Location }) {
    this.txt = ev.txt
    this.location = ev.location
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}