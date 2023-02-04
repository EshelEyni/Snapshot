import { Chat } from './../../models/chat.model';
import { Story } from './../../models/story.model'
import { StoryService } from './../../services/story.service'
import { UserService } from 'src/app/services/user.service'
import { MiniUser } from './../../models/user.model'
import { Component, OnInit, OnChanges, inject } from '@angular/core'
import { Location } from 'src/app/models/post.model'
import { lastValueFrom } from 'rxjs'

@Component({
  selector: 'user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss'],
  inputs: ['user', 'type', 'location', 'chat'],
})
export class UserPreviewComponent implements OnInit, OnChanges {

  constructor() { };

  userService = inject(UserService);
  storyService = inject(StoryService);

  type!: 'home-page-list' | 'post' | 'home-page-logged-in-user-preview' | 'home-page-suggestion-list'
    | 'story-timer' | 'user-story-timer' | 'story' | 'link-to-story-edit' | 'story-edit-page' | 'story-timer'
    | 'chat-setting' | 'chat-post-preview' | 'share-modal' | 'search-modal' | 'followers-list' | 'following-list'
    | 'like-modal' | 'discover-people-list';

  user!: MiniUser;
  chat!: Chat;
  location!: Location | null;
  // story!: Story;

  desc!: string;
  title = '';

  urlForImg: string = '';
  urlForTitle: string = '';
  urlForDesc: string = '';

  isUrlsDisabled: boolean = false;
  isStoryDisabled: boolean = false;
  isStoryViewed: boolean = false;
  isBtnPlusShown: boolean = false;

  storyViewClass: '' | 'story-viewed' | 'story-not-viewed' = '';
  plusBtnSize: number = 16;

  ngOnInit(): void { };

  ngOnChanges(): void {
    this.isBtnPlusShown = this.type === 'user-story-timer'
      || this.type === 'link-to-story-edit';

    this.isStoryDisabled = this.type === 'story-edit-page'
      || this.type === 'link-to-story-edit'
      || this.type === 'user-story-timer'
      || this.type === 'story'
      || this.type === 'story-timer'
      || this.type === 'home-page-logged-in-user-preview'
      || this.type === 'home-page-suggestion-list'
      || this.type === 'share-modal'
      || this.type === 'following-list'
      || this.type === 'followers-list'
      || this.type === 'chat-setting'
      || this.type === 'chat-post-preview';

    if (this.isStoryDisabled) this.storyViewClass = '';
    else if (this.user.currStoryId) {
      this.storyViewClass = this.user.isStoryViewed ? 'story-viewed' : 'story-not-viewed';
    }

    if (this.type === 'user-story-timer') this.plusBtnSize = 14;

    this.title = this.setTitle();
    this.setDesc();
    this.setUrls();
  };

  setTitle(): string {
    const loggedinUser = this.userService.getLoggedinUser();
    if ((loggedinUser && loggedinUser.id === this.user.id && this.type === 'home-page-list')
      || this.type === 'story-edit-page'
      || this.type === 'link-to-story-edit')
      return 'Your story';
    else return this.user.username;
  };

  setUrls(): void {
    switch (this.type) {
      case 'home-page-list':
        this.urlForImg = `/story/${this.user?.currStoryId}`;
        this.urlForTitle = `/story/${this.user?.currStoryId}`;
        break;
      case 'post':
        this.urlForImg = this.user.currStoryId ? `/story/${this.user.currStoryId}` : `/profile/${this.user.id}`;
        this.urlForTitle = `/profile/${this.user.id}`;
        if (this.desc) this.urlForDesc = `/location/${this.location?.name}`;
        break;
      case 'home-page-logged-in-user-preview':
        this.urlForImg = `/profile/${this.user.id}`;
        this.urlForTitle = `/profile/${this.user.id}`;
        break;
      case 'home-page-suggestion-list':
        this.urlForImg = `/profile/${this.user.id}`;
        this.urlForTitle = `/profile/${this.user.id}`;
        break;
      case 'story':
        this.isUrlsDisabled = true;
        break;
      case 'story-timer':
        this.urlForImg = `/profile/${this.user.id}`;
        this.urlForTitle = `/profile/${this.user.id}`;
        break;
      case 'user-story-timer':
        this.urlForImg = `/story-edit`;
        this.urlForTitle = `/story-edit`;
        break;
      case 'link-to-story-edit':
        this.urlForImg = `/story-edit`;
        this.urlForTitle = `/story-edit`;
        break;
      case 'chat-setting':
        this.urlForImg = `/profile/${this.user.id}`;
        this.urlForTitle = `/profile/${this.user.id}`;
        break;
      case 'chat-post-preview':
        this.urlForImg = `/profile/${this.user.id}`;
        this.urlForTitle = `/profile/${this.user.id}`;
        break;
      case 'story-edit-page':
        this.isUrlsDisabled = true;
        break;
      case 'share-modal':
        this.isUrlsDisabled = true;
        break;
      case 'search-modal':
        this.urlForImg = this.user.currStoryId ? `/story/${this.user.currStoryId}` : `/profile/${this.user.id}`;
        this.urlForTitle = `/profile/${this.user.id}`;
        this.desc = this.user.fullname;
        this.urlForDesc = `/profile/${this.user.id}`;
        break;
      default:
        this.urlForImg = `/profile/${this.user.id}`;
        this.urlForTitle = `/profile/${this.user.id}`;
        this.urlForDesc = `/profile/${this.user.id}`;
        break;
    };
  };

  setDesc(): void {
    switch (this.type) {
      case 'post':
        this.desc = this.location ? this.location.name : '';
        break;
      case 'chat-setting':
        if (this.chat.admins.some(a => a.id === this.user.id)) this.desc = `Admin ‧ ${this.user.fullname}`;
        else this.desc = this.user.fullname;
        break;
      case 'story-edit-page':
        this.desc = '';
        break;
      default:
        this.desc = this.user.fullname;
        break;
    };
  };

};