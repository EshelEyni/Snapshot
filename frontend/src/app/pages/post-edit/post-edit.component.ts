import { TagService } from './../../services/tag.service';
import { CommentService } from 'src/app/services/comment.service';
import { PostService } from './../../services/post.service';
import { UserService } from 'src/app/services/user.service';
import { UploadImgService } from './../../services/upload-img.service';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { User } from './../../models/user.model';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { PostCanvasImg } from 'src/app/models/post.model';
import { Observable, Subscription, map } from 'rxjs';
import { Location } from '@angular/common';
import { Location as postLocation } from 'src/app/models/post.model'
import { SaveUser } from 'src/app/store/actions/user.actions';

@Component({
  selector: 'post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser))
  }

  @ViewChild('offScreenCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  $location = inject(Location)
  store = inject(Store<State>)
  uploadImgService = inject(UploadImgService)
  userService = inject(UserService)
  postService = inject(PostService)
  commentService = inject(CommentService)
  tagService = inject(TagService)

  faChevronLeft = faChevronLeft;
  currTitle: string = 'create new post'
  sub: Subscription | null = null
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  postImgs: PostCanvasImg[] = [
    // {
    //   url: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667001489/github-icon_2_ixseoz.png',
    //   x: 0,
    //   y: 0,
    //   width: 830,
    //   height: 830,
    //   aspectRatio: 'Original',
    //   zoom: 0,
    //   filter: 'normal',
    // },
    {
      url: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664789187/jsywue9raehtraavttaw.jpg',
      x: 0,
      y: 0,
      width: 830,
      height: 830,
      aspectRatio: 'Original',
      zoom: 0,
      filter: 'normal',
    },
    {
      url: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664328265/ubgpmrhtkoi4syzj5w0r.jpg',
      x: 0,
      y: 0,
      width: 830,
      height: 830,
      aspectRatio: 'Original',
      zoom: 0,
      filter: 'normal',
    },
  ];
  txt: string = '';
  location: postLocation = {
    id: 0,
    lat: 0,
    lng: 0,
    name: '',
  };
  currEditMode: string = 'crop';
  btnTxt: string = 'next';
  currFilter!: string;
  isSaving: boolean = false;
  canvasSize: number = 830;
  
  ngOnInit(): void {

    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) {
        this.loggedinUser = { ...user }
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



  onSetFilter(filter: string) {
    this.currFilter = filter
  }



  onGoBack() {
    if (this.currEditMode === 'crop') this.$location.back()
    else if (this.currEditMode === 'filter') {
      this.currEditMode = 'crop'
      this.currTitle = 'create new post'
    }
    else if (this.currEditMode === 'txt-location') {
      this.currEditMode = 'filter'
      this.btnTxt = 'next'
      this.currTitle = 'edit'
    }
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
    this.isSaving = true;
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
      this.tagService.detectTags(this.txt);
      const commentToAdd = this.commentService.getEmptyComment();
      commentToAdd.text = this.txt;
      commentToAdd.by = author;
      commentToAdd.postId = postId;
      commentToAdd.isOriginalText = true;
      await this.commentService.save(commentToAdd);
    }

    this.loggedinUser.postSum++;
    this.store.dispatch(new SaveUser(this.loggedinUser));


    this.$location.back();
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

          const canvasSize = window.innerWidth > 1260 ? 830 : window.innerWidth;
          switch (canvasImg.aspectRatio) {
            case 'Original':
              offScreenCanvas.width = canvasSize;
              offScreenCanvas.height = canvasSize;
              break;
            case '1:1':
              offScreenCanvas.width = canvasSize;
              offScreenCanvas.height = canvasSize;
              break;
            case '4:5':
              offScreenCanvas.width = canvasSize * .8;
              offScreenCanvas.height = canvasSize;
              break;
            case '16:9':
              offScreenCanvas.width = canvasSize;
              offScreenCanvas.height = canvasSize * .5625;
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

          offScreenCtx.fillStyle = 'rgba(38, 38, 38)';
          offScreenCtx.fillRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);

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

  onChangePost(ev: { txt: string; location: postLocation }) {
    this.txt = ev.txt
    this.location = ev.location
  }


  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }
}
