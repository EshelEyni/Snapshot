import { Post } from './../../models/post.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { PostService } from './../../services/post.service';
import { Tag } from './../../models/tag';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.scss']
})
export class TagDetailsComponent implements OnInit {

  constructor() { }
  postService = inject(PostService);
  route = inject(ActivatedRoute);
  tag!: Tag;
  posts: Post[] = [];
  paramsSubscription!: Subscription;


  ngOnInit(): void {
    this.paramsSubscription = this.route.data.subscribe(data => {
      const tag = data['tag']
      if (tag) {
        this.tag = tag
        tag.postsIds.forEach(async (postId: string) => {
          const post = await lastValueFrom(this.postService.getById(postId))
          this.posts.push({...post})
        })
      }
    })
  }

}
