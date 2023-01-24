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

  constructor() { }

  userService = inject(UserService);
  storyService = inject(StoryService);

  user!: MiniUser;
  story!: Story;
  isStoryDisabled: boolean = false;
  isStoryViewed: boolean = false;
  type!: string;
  desc!: string;
  title = '';
  location!: Location | null;
  urlForImg: string = '';
  urlForTitle: string = '';
  urlForDesc: string = '';
  isUrlsDisabled!: boolean;
  userImgClass: string = '';
  isBtnPlusShown: boolean = false;
  plusBtnSize: number = 16;
  chat!: Chat;

  async ngOnInit() {

    // this.isStoryDisabled = this.type === 'story-edit-page'
    //   || this.type === 'link-to-story-edit'
    //   || this.type === 'user-story-timer'
    //   || this.type === 'story'
    //   || this.type === 'story-timer'
    //   || this.type === 'suggestion-list'
    //   || this.type === 'home-page-suggestion-list'

    // this.isBtnPlusShown = this.type === 'user-story-timer'
    //   || this.type === 'link-to-story-edit'

    if (!this.isStoryDisabled) {
      const user = await lastValueFrom(this.userService.getById(this.user.id))
      if (user && user.currStoryId) {
        const story = await lastValueFrom(
          this.storyService.getById(user.currStoryId, 'user-preview'),
        )

        const loggedinUser = this.userService.getLoggedinUser()
        if (loggedinUser) {
          this.isStoryViewed = story.viewedBy.some(u => u.id === loggedinUser.id)
          this.userImgClass = this.isStoryViewed ? 'story-viewed' : 'story-not-viewed'
        }
        this.story = story
      }
    }
    this.title = this.setTitle()
    this.setDesc()
    this.setUrls()
  }

  ngOnChanges() {
    this.isBtnPlusShown = this.type === 'user-story-timer'
      || this.type === 'link-to-story-edit'

    this.isStoryDisabled = this.type === 'story-edit-page'
      || this.type === 'link-to-story-edit'
      || this.type === 'user-story-timer'
      || this.type === 'story'
      || this.type === 'story-timer'
      || this.type === 'suggestion-list'
      || this.type === 'home-page-suggestion-list'
      || this.type === 'share-modal'
      || this.type === 'following-list'
      || this.type === 'followers-list'
      || this.type === 'chat-setting'

    if (this.isStoryDisabled) this.userImgClass = ''
    if (this.type === 'user-story-timer') this.plusBtnSize = 14

    this.title = this.setTitle()
    this.setDesc()
    this.setUrls()
  }

  setTitle() {
    const loggedinUser = this.userService.getLoggedinUser()
    if (
      (loggedinUser &&
        loggedinUser.id === this.user.id &&
        this.type === 'home-page-list') ||
      this.type === 'story-edit-page' ||
      this.type === 'link-to-story-edit'
    )
      return 'Your story'
    else return this.user.username
  }

  setUrls() {
    switch (this.type) {
      case 'home-page-list':
        this.urlForImg = `/story/${this.story?.id}`
        this.urlForTitle = `/story/${this.story?.id}`
        break
      case 'post':
        this.urlForImg = this.story
          ? `/story/${this.story.id}`
          : `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        if (this.desc) this.urlForDesc = `/location/${this.location?.name}`
        break
      case 'suggestion-list':
        this.urlForImg = `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        break
      case 'home-page-suggestion-list':
        this.urlForImg = `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        break
      case 'story':
        this.isUrlsDisabled = true;
        break
      case 'story-timer':
        this.urlForImg = `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        break
      case 'user-story-timer':
        this.urlForImg = `/story-edit`
        this.urlForTitle = `/story-edit`
        break
      case 'link-to-story-edit':
        this.urlForImg = `/story-edit`
        this.urlForTitle = `/story-edit`
        break
      case 'chat-setting':
        this.urlForImg = `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        break
      case 'story-edit-page':
        this.isUrlsDisabled = true;
        break
      case 'share-modal':
        this.isUrlsDisabled = true;
        break
      case 'search-modal':
        this.urlForImg = this.story
          ? `/story/${this.story.id}`
          : `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        this.desc = this.user.fullname
        this.urlForDesc = `/profile/${this.user.id}`
        break
      default:
        this.urlForImg = `/`
        this.urlForTitle = `/`
        this.urlForDesc = `/`
        break
    }
  }

  setDesc() {
    switch (this.type) {
      case 'post':
        this.desc = this.location ? this.location.name : ''
        break
      case 'suggestion-list':
        this.desc = this.user.fullname
        break
      case 'home-page-suggestion-list':
        this.desc = this.user.fullname
        break
      case 'search-modal':
        this.desc = this.user.fullname
        break
      case 'chat-setting':
        if (this.chat.admins.some(a => a.id === this.user.id)) this.desc = `Admin ‧ ${this.user.fullname}`
        else this.desc = this.user.fullname
        break
    }

  }

  setWatchedStory() {
    if (this.isStoryViewed || !this.story) return
    this.story.viewedBy.push(this.user)
    this.storyService.save(this.story)
    this.isStoryViewed = true
  }
}
