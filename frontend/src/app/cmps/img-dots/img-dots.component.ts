import { Component, OnInit } from '@angular/core';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'img-dots',
  templateUrl: './img-dots.component.html',
  styleUrls: ['./img-dots.component.scss'],
  inputs: ['imgUrls','currImgUrl']
})
export class ImgDotsComponent implements OnInit {

  constructor() { }

  // Icons
  faCircle = faCircle;
  imgUrls: string[] = [];
  currImgUrl: string = '';

  ngOnInit(): void {
  }

}
