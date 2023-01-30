import { Component, OnInit } from '@angular/core';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'like-icon',
  templateUrl: './like-icon.component.html',
  styleUrls: ['./like-icon.component.scss'],
  inputs: ['isLiked'],
})
export class LikeIconComponent implements OnInit {

  constructor() { };

  faHeart = faHeart;
  faHeartSolid = faHeartSolid;
  isLiked!: boolean;

  ngOnInit(): void { };
};