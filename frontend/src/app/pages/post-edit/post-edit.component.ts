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
      .pipe(map((x) => x.loggedinUser));
  };

  $location = inject(Location);
  store = inject(Store<State>);
  uploadImgService = inject(UploadImgService);
  userService = inject(UserService);
  postService = inject(PostService);
  commentService = inject(CommentService);
  tagService = inject(TagService);

  @ViewChild('offScreenCanvas', { static: true }) offScreenCanvas!: ElementRef<HTMLCanvasElement>;
  faChevronLeft = faChevronLeft;

  sub: Subscription | null = null;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  postImgs: PostCanvasImg[] = [];

  txt: string = '';
  location: postLocation = {
    id: 0,
    lat: 0,
    lng: 0,
    name: '',
  };

  currFilter!: string;
  currTitle: string = 'create new post';
  currEditMode: string = 'crop';
  btnTxt: string = 'next';

  isSaving: boolean = false;
  isUploading: boolean = false;

  ngOnInit(): void {

    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) {
        this.loggedinUser = { ...user };
      };
    });
  };

  onToggleIsUploading() {
    this.isUploading = !this.isUploading;
  };

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
      };
    });
    this.currEditMode = 'crop';
    this.currTitle = 'crop';
  };

  onSetFilter(filter: string) {
    this.currFilter = filter;
  };

  onGoBack() {
    if (this.currEditMode === 'crop') this.$location.back();
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

  onNext() {
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

  async savePost() {
    this.isSaving = true;
    const postToSave = this.postService.getEmptyPost();
    const author = this.userService.getMiniUser(this.loggedinUser);
    await this.postService.convertCanvasImgsToImgUrls(this.offScreenCanvas.nativeElement, this.postImgs, postToSave.imgUrls);
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
    };

    this.loggedinUser.postSum++;
    this.store.dispatch(new SaveUser(this.loggedinUser));
    this.$location.back();
  };

  onChangePost(ev: { txt: string; location: postLocation }) {
    this.txt = ev.txt;
    this.location = ev.location;
  };

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  };
};