import { Tag } from './../../models/tag.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
  inputs: ['tags']
})
export class TagListComponent implements OnInit {

  constructor() { }
  tags!: Tag[];

  ngOnInit(): void {
  }

}
