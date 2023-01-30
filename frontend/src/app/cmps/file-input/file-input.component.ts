import { Observable, Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from './../../store/store';
import { User } from './../../models/user.model';
import { UploadImgService } from './../../services/upload-img.service';
import { Component, OnInit, HostListener, inject, EventEmitter, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  inputs: ['type'],
  outputs: ['uploadedImgUrls', 'isUploading']
})
export class FileInputComponent implements OnInit, OnDestroy {

  constructor() {
    this.loggedinUser$ = this.store
      .select('userState')
      .pipe(map((x) => x.loggedinUser));
  };

  @ViewChildren('svgIcon') icons!: QueryList<SvgIconComponent>;

  uploadImgService = inject(UploadImgService);
  store = inject(Store<State>);

  type!: 'draggable' | 'btn-plus' | 'btn-img';

  sub: Subscription | null = null;
  loggedinUser$: Observable<User | null>;
  loggedinUser!: User;
  imgUrls: string[] = [];

  dragAreaClass!: string;
  iconColor: string = 'var(--tertiary-color)';
  btnText: string = window.innerWidth<770 ?'Select from device':'Select from computer';
  uploadedImgUrls = new EventEmitter<string[]>();
  isUploading = new EventEmitter();

  ngOnInit(): void {
    this.dragAreaClass = "dragarea";

    this.sub = this.loggedinUser$.subscribe((user) => {
      if (user) {
        this.loggedinUser = { ...user };

        setTimeout(() => {
          this.setIconColor();
        }, 0);
      };
    });
  };

  setIconColor() {
    this.iconColor = this.loggedinUser.isDarkMode ? 'var(--primary-color)' : 'var(--tertiary-color)';
    this.icons.forEach(icon => {
      icon.svgStyle = { color: this.iconColor, fill: this.iconColor };
    });
  };


  @HostListener("dragover", ["$event"])
  onDragOver(event: any): void {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  };

  @HostListener("dragenter", ["$event"])
  onDragEnter(event: any): void {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  };

  @HostListener("dragend", ["$event"])
  onDragEnd(event: any): void {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  };

  @HostListener("dragleave", ["$event"])
  onDragLeave(event: any): void {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  };

  @HostListener("drop", ["$event"])
  onDrop(event: any): void {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    };
  };

  onFileChange(event: any): void {
    let files: FileList = event.target.files;
    this.saveFiles(files);
  };

  async saveFiles(files: FileList): Promise<void> {
    this.isUploading.emit();
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await this.uploadImgService.uploadImg(files[i]);
        this.imgUrls.push(url);
      }
      catch (err) {
        console.log('ERROR!', err);
      };

    };
    this.isUploading.emit();
    this.uploadedImgUrls.emit(this.imgUrls);
  };

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  };
};