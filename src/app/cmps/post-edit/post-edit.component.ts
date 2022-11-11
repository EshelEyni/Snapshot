import { UploadImgService } from './../../services/upload-img.service';
import { Component, OnInit, inject, HostListener } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {

  constructor() { }
  uploadImgService = inject(UploadImgService)

  faX = faX;
  imgUrls: string[] = [];
  dragAreaClass!: string;

  ngOnInit() {
    this.dragAreaClass = "dragarea";
  }

  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.saveFiles(files);
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
    console.log('files', files)

  }

}
