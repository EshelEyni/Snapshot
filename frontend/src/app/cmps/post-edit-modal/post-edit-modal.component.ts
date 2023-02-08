import { SaveUser } from './../../store/actions/user.actions';
import { TagService } from './../../services/tag.service';
import { PostCanvasImg } from './../../models/post.model';
import { User } from 'src/app/models/user.model'
import { Observable, Subscription, map } from 'rxjs'
import { State } from './../../store/store'
import { Store } from '@ngrx/store'
import { CommentService } from 'src/app/services/comment.service'
import { PostService } from 'src/app/services/post.service'
import { UploadImgService } from './../../services/upload-img.service'
import { Component, OnInit, inject, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, } from '@angular/core'
import { faX, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { UserService } from 'src/app/services/user.service'
import { Location } from 'src/app/models/post.model'

@Component({
  selector: 'post-edit-modal',
  templateUrl: './post-edit-modal.component.html',
  styleUrls: ['./post-edit-modal.component.scss'],
  outputs: ['togglePostEdit'],
})

export class PostEditModalComponent implements OnInit, OnDestroy {
  constructor() {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser));
  };

  @ViewChild('offScreenCanvas', { static: true }) offScreenCanvas!: ElementRef<HTMLCanvasElement>;

  store = inject(Store<State>);
  uploadImgService = inject(UploadImgService);
  userService = inject(UserService);
  postService = inject(PostService);
  commentService = inject(CommentService);
  tagService = inject(TagService);

  // Icons
  faX = faX;
  faArrowLeft = faArrowLeft;

  sub: Subscription | null = null;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  postImgs: PostCanvasImg[] = [];

  txt: string = '';
  location: Location = {
    id: 0,
    lat: 0,
    lng: 0,
    name: '',
  };

  currEditMode: string = 'crop';
  currTitle: string = 'create new post'
  btnTxt: string = 'next';
  currFilter!: string;

  isSaving: boolean = false;
  isUploading: boolean = false;

  togglePostEdit = new EventEmitter()

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) {
        this.loggedinUser = { ...user };
      };
    });
  };


  onSaveFiles(imgUrls: string[]): void {
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
      };
    });
    this.currEditMode = 'crop';
    this.currTitle = 'crop';
  };

  onTogglePostEdit(): void {
    this.togglePostEdit.emit();
  };

  onSetFilter(filter: string): void {
    this.currFilter = filter;
  };

  onToggleIsUploading(): void {
    this.isUploading = !this.isUploading;
  };

  onGoBack(): void {
    if (this.currEditMode === 'crop') this.onTogglePostEdit();
    else if (this.currEditMode === 'filter') {
      this.currEditMode = 'crop';
      this.currTitle = 'create new post';
    }
    else if (this.currEditMode === 'txt-location') {
      this.currEditMode = 'filter';
      this.btnTxt = 'next';
      this.currTitle = 'edit';
    };
  };

  onNext(): void {
    if (this.currEditMode === 'crop') {
      this.currEditMode = 'filter';
      this.currTitle = 'edit';
    }
    else if (this.currEditMode === 'filter') {
      this.currEditMode = 'txt-location';
      this.btnTxt = 'share';
      this.currTitle = 'create new post';
    }
    else if (this.currEditMode === 'txt-location') this.savePost();
  };

  async savePost(): Promise<void> {
    this.isSaving = true;
    const postToSave = this.postService.getEmptyPost();
    const author = this.userService.getMiniUser(this.loggedinUser);
    await this.postService.convertCanvasImgsToImgUrls(this.offScreenCanvas.nativeElement, this.postImgs, postToSave.imgUrls);
    postToSave.by = author;
    postToSave.location = this.location;
    postToSave.tags = this.tagService.detectTags(this.txt);
    const postId = await this.postService.save(postToSave);

    if (this.txt && typeof postId === 'number') {
      this.tagService.detectTags(this.txt);
      const commentToAdd = this.commentService.getEmptyComment();
      commentToAdd.text = this.txt;
      commentToAdd.by = author;
      commentToAdd.postId = postId;
      commentToAdd.isOriginalText = true;
      await this.commentService.save(commentToAdd);
    };

    this.loggedinUser.postSum++;
    this.store.dispatch(new SaveUser(this.loggedinUser));
    this.onTogglePostEdit();
  };


  onToggleEditSettings(currSetting: string): void {
    this.currEditMode = currSetting;
  };

  onChangePost(ev: { txt: string; location: Location }): void {
    this.txt = ev.txt;
    this.location = ev.location;
  };

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  };
};