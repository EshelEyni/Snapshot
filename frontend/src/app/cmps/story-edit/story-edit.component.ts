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

  constructor() { }


  store = inject(Store<State>);
  userService = inject(UserService);

  // storyImgs: { url: string, items: [] }[] = [];
  storyImgs: StoryImg[] = [
    {
      url: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044177/ukfallhy757gdlswvfuj.jpg',
      items: []
    },
    {
      url: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669305397/p7o8v7gvoy3bgdcymu0d.jpg',
      items: []
    },
    {
      url: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044038/pxbi0wi3po7fiadwdcke.jpg',
      items: []
    },
  ];

  isEditMode: boolean = false;

  ngOnInit(): void {

  }

  onSetFiles(imgUrls: string[]) {
    this.storyImgs = imgUrls.map(imgUrl => ({ url: imgUrl, items: [] }));
    this.isEditMode = true;
  }

  onGoBack() {
    this.isEditMode = false;
    this.storyImgs = [];
  }

}