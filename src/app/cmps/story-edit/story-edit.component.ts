import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'story-edit',
  templateUrl: './story-edit.component.html',
  styleUrls: ['./story-edit.component.scss']
})
export class StoryEditComponent implements OnInit {

  constructor() { }

// imgUrls: string[] = [];
imgUrls: string[] = [
  'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044177/ukfallhy757gdlswvfuj.jpg',
  'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669305397/p7o8v7gvoy3bgdcymu0d.jpg',
  'https://res.cloudinary.com/dng9sfzqt/image/upload/v1667044038/pxbi0wi3po7fiadwdcke.jpg',
];
isEditMode: boolean = true;

  ngOnInit(): void {
  }

  onSaveFiles(imgUrls: string[]) {
    this.imgUrls = imgUrls;
    this.isEditMode = true;
    }

}
