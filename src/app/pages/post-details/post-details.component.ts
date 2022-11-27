import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,

  ) { }

  post!: Post
  paramsSubscription!: Subscription

  async ngOnInit() {
    this.paramsSubscription = this.route.data.subscribe(data => {
      const post = data['post']
      if (post) this.post = post
    })
  }

}
