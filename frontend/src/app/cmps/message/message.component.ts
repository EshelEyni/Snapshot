import { Post } from './../../models/post.model';
import { lastValueFrom } from 'rxjs';
import { PostService } from './../../services/post.service';
import { User } from 'src/app/models/user.model';
import { Message } from 'src/app/models/chat.model';
import { Component, OnInit, inject } from '@angular/core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { StoryService } from 'src/app/services/story.service';
import { Story } from 'src/app/models/story.model';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  inputs: ['message', 'loggedinUser']
})
export class MessageComponent implements OnInit {

  constructor() { };

  postService = inject(PostService);
  storyService = inject(StoryService);

  post!: Post;
  story!: Story;
  message!: Message;
  loggedinUser!: User;

  storyReactionTitle: string = '';

  isUserImgShown: boolean = true;
  isSenderLoggedinUser = false;
  faHeart = faHeart;

  async ngOnInit() {
    this.isSenderLoggedinUser = this.message.sender.id === this.loggedinUser.id;

    switch (this.message.type) {
      case 'post':
        if (this.message.postId)
          this.post = await lastValueFrom(this.postService.getById(this.message.postId));
        break;
      case 'story':
        if (this.message.storyId) {
          // this.story = await lastValueFrom(this.storyService.getById(this.message.storyId, 'chat'));
          this.storyReactionTitle = this.isSenderLoggedinUser
            ? `You sent ${this.story.by.username} story`
            : `${this.message.sender.username} sent ${this.story.by.username} story`;
          this.isUserImgShown = false;
        };
        break;
      case 'quick-reaction':
        this.storyReactionTitle = this.isSenderLoggedinUser
          ? `You reacted to their story: ${this.message.text}`
          : `Reacted to your story: ${this.message.text}`;
        this.isUserImgShown = false;
        break;

      case 'story-reply':
        this.storyReactionTitle = this.isSenderLoggedinUser
          ? `You replied to their story`
          : `Replied to your story`;
        this.isUserImgShown = false;
        break;
      case 'story-like':
        this.storyReactionTitle = this.isSenderLoggedinUser
          ? `You liked their story`
          : `Liked your story`;
        this.isUserImgShown = false;
        break;
    };
  };
};