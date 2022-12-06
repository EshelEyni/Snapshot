import { LoadLoggedInUser } from './../../store/actions/user.actions';
import { User } from 'src/app/models/user.model';
import { Observable, Subscription, map } from 'rxjs';
import { State } from './../../store/store';
import { Store } from '@ngrx/store';
import { CommentService } from 'src/app/services/comment.service';
import { UtilService } from './../../services/util.service';
import { PostService } from 'src/app/services/post.service';
import { UploadImgService } from './../../services/upload-img.service';
import { Component, OnInit, inject, HostListener, Output, EventEmitter, OnDestroy } from '@angular/core';
import { faX, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { Location, Post } from 'src/app/models/post.model';

@Component({
  selector: 'post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit,OnDestroy {
  @Output() togglePostEdit = new EventEmitter<boolean>()

  constructor(
    private store: Store<State>

  ) {
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));
  }
  uploadImgService = inject(UploadImgService)
  userService = inject(UserService)
  postService = inject(PostService)
  UtilService = inject(UtilService)
  commentService = inject(CommentService)

  // Icons
  faX = faX;
  faArrowLeft = faArrowLeft;


  sub: Subscription | null = null;
  loggedinUser$: Observable<User | null>
  loggedinUser!: User
  currTitle: string = 'create new post';
  imgUrls: string[] = [];
  // imgUrls: string[] = [
  //   'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669305397/p7o8v7gvoy3bgdcymu0d.jpg',
  //   'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044177/ukfallhy757gdlswvfuj.jpg',
  //   'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044038/pxbi0wi3po7fiadwdcke.jpg',
  // ];
  txt: string = '';
  location: Location = {
    lat: 0,
    lng: 0,
    name: ''
  }
  isEditMode: boolean = true;
  currEditModeSettings: string = 'filters';
  currImg: string = this.imgUrls[0];
  dragAreaClass!: string;

  ngOnInit() {
    this.dragAreaClass = "dragarea";
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = JSON.parse(JSON.stringify(user))
      }
    })
  }

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    }
  }

  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.saveFiles(files);
  }

  async saveFiles(files: FileList) {

    for (let i = 0; i < files.length; i++) {
      try {
        const url = await this.uploadImgService.uploadImg(files[i])
        this.imgUrls.push(url)
        this.isEditMode = true;
      }
      catch (err) {
        console.log('ERROR!', err)
      }

    }
  }

  onTogglePostEdit() {
    this.togglePostEdit.emit(false)
  }

  onGoBack() {
    this.isEditMode = false;
    this.imgUrls = []
  }

  onShare() {
    this.savePost()
  }

  async savePost() {

    const postToSave = this.postService.getEmptyPost()
    postToSave.imgUrls = this.imgUrls
    postToSave.by = this.userService.getMiniUser(this.loggedinUser)
    postToSave.location = this.location

    if (this.txt) {
      const commentToAdd = this.commentService.getEmptyComment()
      commentToAdd.txt = this.txt
      commentToAdd.by = this.userService.getMiniUser(this.loggedinUser)
      const commentId = await this.commentService.save(commentToAdd)
      if (commentId) postToSave.commentsIds.push(commentId)
    }

    await this.postService.save(postToSave, this.loggedinUser.id)
    this.onTogglePostEdit()
  }

  onToggleEditSettings(currSetting: string) {
    this.currEditModeSettings = currSetting
  }

  onChangePost(ev: { txt: string, location: string }) {
    this.txt = ev.txt
    this.location.name = ev.location
  }


  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}
