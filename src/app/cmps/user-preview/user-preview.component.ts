import { MiniUser } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { Location } from 'src/app/models/post.model';

@Component({
  selector: 'user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss'],
  inputs: ['user', 'location']
})
export class UserPreviewComponent implements OnInit {

  constructor() { }

  user!: MiniUser;
  location!: Location;
  
  ngOnInit(): void {
  }

}
