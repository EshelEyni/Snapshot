import { MiniUser } from './../../models/user.model';
import { lastValueFrom } from 'rxjs';
import { Location } from './../../models/post.model';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'post-edit-form',
  templateUrl: './post-edit-form.component.html',
  styleUrls: ['./post-edit-form.component.scss']
})
export class PostEditFormComponent implements OnInit {

  constructor() { }
  userService = inject(UserService)
  @Input() txt!: string;
  @Input() location!: Location;
  @Output() postChanged = new EventEmitter<{ txt: string, location: string }>()

  user = {
    _id: "user101",
    fullname: "Yael Cohen",
    username: 'yael_c',
    imgUrl: "https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg",
    savedPostsIds: ['']
  }

  ngOnInit(): void {

  }

  onChange() {
    this.postChanged.emit({ txt: this.txt, location: this.location.name })
  }

}
