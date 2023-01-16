import { Store } from '@ngrx/store';
import { State } from './../../store/store';
import { User } from './../../models/user.model';
import { UploadImgService } from './../../services/upload-img.service';
import { Component, OnInit, HostListener, inject, EventEmitter, ViewChild } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  inputs: ['type', 'loggedinUser'],
  outputs: ['uploadedImgUrls']
})
export class FileInputComponent implements OnInit {

  constructor() {

  }

  @ViewChild('svgIcon') icons!: SvgIconComponent;

  uploadImgService = inject(UploadImgService)
  store = inject(Store<State>)
  type!: string;
  dragAreaClass!: string;
  imgUrls: string[] = [];
  uploadedImgUrls = new EventEmitter<string[]>();
  iconColor: string = 'var(--tertiary-color)'
  loggedinUser!: User;

  ngOnInit(): void {
    this.dragAreaClass = "dragarea";

    setTimeout(() => {
      this.setIconColor()
    }, 0);
  }

  setIconColor() {
    this.iconColor = this.loggedinUser.isDarkMode ? 'var(--primary-color)' : 'var(--tertiary-color)'
    this.icons.svgStyle = { color: this.iconColor, fill: this.iconColor }
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
      }
      catch (err) {
        console.log('ERROR!', err)
      }

    }

    this.uploadedImgUrls.emit(this.imgUrls)
  }
}
