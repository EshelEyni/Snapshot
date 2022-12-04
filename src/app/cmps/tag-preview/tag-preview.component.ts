import { Tag } from './../../models/tag';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tag-preview',
  templateUrl: './tag-preview.component.html',
  styleUrls: ['./tag-preview.component.scss'],
  inputs: ['tag']
})
export class TagPreviewComponent implements OnInit {

  constructor() { }
  
  tag!: Tag;

  ngOnInit(): void {
  }

}
