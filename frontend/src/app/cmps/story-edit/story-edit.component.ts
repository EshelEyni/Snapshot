import { LoadLoggedInUser } from './../../store/actions/user.actions';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user.model';
import { Observable, map, Subscription } from 'rxjs';
import { State } from './../../store/store';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { StoryImg } from 'src/app/models/story.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'story-edit',
  templateUrl: './story-edit.component.html',
  styleUrls: ['./story-edit.component.scss']
})
export class StoryEditComponent implements OnInit {

  constructor() { 
    this.loggedinUser$ = this.store.select('userState').pipe(map(x => x.loggedinUser));

  }


  store = inject(Store<State>);
  userService = inject(UserService);

  storyImgs: StoryImg[] = [
    // {
    //   url: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666727081/fpswmz9kgjouuoaj2va1.jpg',
    //   items: []
    // },
    // {
    //   url: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg',
    //   items: []
    // },
    // {
    //   url: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664739345/yqvuwzj1lp7ozm53fqps.jpg',
    //   items: []
    // },
  ];

  loggedinUser!: User;
  sub!: Subscription;
  loggedinUser$: Observable<User | null>;

  ngOnInit(): void {
    this.sub = this.loggedinUser$.subscribe(user => {
      if (user) {
        this.loggedinUser = { ...user }
      }
    })
  }

  

  onSetFiles(imgUrls: string[]) {
    this.storyImgs = imgUrls.map(imgUrl => ({ url: imgUrl, items: [] }));
  }
}