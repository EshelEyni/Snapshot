import { Tag } from '../../models/tag.model';
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
