import { UploadImgService } from './../../services/upload-img.service';
import { Component, OnInit, inject, HostListener, Output, EventEmitter } from '@angular/core';
import { faX, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
  @Output() togglePostEdit = new EventEmitter<boolean>()

  constructor() { }
  uploadImgService = inject(UploadImgService)

  // Icons
  faX = faX;
  faArrowLeft = faArrowLeft;

  currTitle: string = 'create new post';
  btnTxt: string = 'next';
  imgUrls: string[] = [];
  isEditMode: boolean = false;
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
        this.currTitle = 'crop'

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
    console.log('go back');
    this.currTitle = 'create new post'
    this.imgUrls = []
    console.log('this.imgUrls', this.imgUrls);
    console.log('this.currTitle', this.currTitle);
  }

  onGoNext() {
    if(this.currTitle === 'crop') {
      this.currTitle = 'edit'
      this.isEditMode = true
    } else if(this.currTitle === 'edit') {
      this.currTitle = 'create new post'
      this.btnTxt = 'share'
    } else if(this.currTitle === 'create new post') {
      this.onTogglePostEdit()
    }
  }

  onToggleEditSettings(currSetting: string) {
      this.currEditModeSettings = currSetting
  }
}
