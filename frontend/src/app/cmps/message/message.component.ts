import { Post } from './../../models/post.model';
import { lastValueFrom } from 'rxjs';
import { PostService } from './../../services/post.service';
import { User } from 'src/app/models/user.model';
import { Message } from 'src/app/models/chat.model';
import { Component, OnInit, inject } from '@angular/core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  inputs: ['message', 'loggedinUser']
})
export class MessageComponent implements OnInit {

  constructor() { }
  postService = inject(PostService);
  post!: Post;
  message!: Message;
  loggedinUser!: User;
  isSenderLoggedinUser = false;
  faHeart = faHeart;

  async ngOnInit() {
    this.isSenderLoggedinUser = this.message.sender.id === this.loggedinUser.id

    if (this.message.type === 'post' && this.message.postId) {
      this.post = await lastValueFrom(this.postService.getById(this.message.postId))
    }
  }

}
