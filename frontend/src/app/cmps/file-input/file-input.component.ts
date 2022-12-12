import { UploadImgService } from './../../services/upload-img.service';
import { Component, OnInit, HostListener, inject, EventEmitter } from '@angular/core';

@Component({
  selector: 'file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  inputs: ['type'],
  outputs: ['uploadedImgUrls']
})
export class FileInputComponent implements OnInit {

  constructor() { }

  uploadImgService = inject(UploadImgService)
  type!: string;
  dragAreaClass!: string;
  imgUrls: string[] = [];
  uploadedImgUrls = new EventEmitter<string[]>();

  ngOnInit(): void {
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
      }
      catch (err) {
        console.log('ERROR!', err)
      }

    }

    this.uploadedImgUrls.emit(this.imgUrls)
  }
}
