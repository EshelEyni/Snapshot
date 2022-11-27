import { UtilService } from './../../services/util.service';
import { PostService } from 'src/app/services/post.service';
import { UploadImgService } from './../../services/upload-img.service';
import { Component, OnInit, inject, HostListener, Output, EventEmitter } from '@angular/core';
import { faX, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { Location, Post } from 'src/app/models/post.model';

@Component({
  selector: 'post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
  @Output() togglePostEdit = new EventEmitter<boolean>()

  constructor() { }
  uploadImgService = inject(UploadImgService)
  userService = inject(UserService)
  postService = inject(PostService)
  UtilService = inject(UtilService)

  // Icons
  faX = faX;
  faArrowLeft = faArrowLeft;

  currTitle: string = 'create new post';
  imgUrls: string[] = [];
  // imgUrls: string[] = [
  //   'https://res.cloudinary.com/dng9sfzqt/image/upload/v1668095950/cbtrkoffzcqreo533m1a.jpg',
  //   'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667043202/o2o9bcdqroy1asyrk09a.jpg'
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
    const loggedinUser = this.userService.getLoggedinUser()
    if (!loggedinUser) return
    const { id, username, fullname, imgUrl } = loggedinUser
    const postToSave = {
      id: '',
      txt: this.txt,
      imgUrls: this.imgUrls,
      by: { id, fullname, username, imgUrl },
      location: this.location,
      likedBy: [],
      commentsIds: [],
      createdAt: new Date(),
      tags: []
    } as Post

    this.postService.save(postToSave, id)

    this.onTogglePostEdit()
  }

  onToggleEditSettings(currSetting: string) {
    this.currEditModeSettings = currSetting
  }

  onChangePost(ev: { txt: string, location: string }) {
    this.txt = ev.txt
    this.location.name = ev.location
  }
}
