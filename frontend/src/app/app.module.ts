// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HammerModule } from "../../node_modules/@angular/platform-browser";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppEffects } from './store/app.effects';
import { environment } from '../environments/environment';
import { reducers, metaReducers } from './store/store';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AngularDraggableModule } from 'angular2-draggable';

// Components
import { AppComponent } from './app-root/app.component';
import { HomeComponent } from './pages/home/home.component';
import { PostListComponent } from './cmps/post-list/post-list.component';
import { PostPreviewComponent } from './cmps/post-preview/post-preview.component';
import { SideBarComponent } from './cmps/side-bar/side-bar.component';
import { CommentComponent } from './cmps/comment/comment.component';
import { CommentListComponent } from './cmps/comment-list/comment-list.component';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { ShareModalComponent } from './cmps/share-modal/share-modal.component';
import { UserListComponent } from './cmps/user-list/user-list.component';
import { PostEditComponent } from './cmps/post-edit/post-edit.component';
import { ImgContainerComponent } from './cmps/img-container/img-container.component';
import { PostEditFormComponent } from './cmps/post-edit-form/post-edit-form.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { PostDetailsComponent } from './pages/post-details/post-details.component';
import { ProfileDetailsComponent } from './pages/profile-details/profile-details.component';
import { UserPreviewComponent } from './cmps/user-preview/user-preview.component';
import { EllipsisComponent } from './cmps/ellipsis/ellipsis.component';
import { PostActionsComponent } from './cmps/post-actions/post-actions.component';
import { CommentEditComponent } from './cmps/comment-edit/comment-edit.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { SearchBarComponent } from './cmps/search-bar/search-bar.component';
import { SearchModalComponent } from './cmps/search-modal/search-modal.component';
import { TagPreviewComponent } from './cmps/tag-preview/tag-preview.component';
import { TagDetailsComponent } from './pages/tag-details/tag-details.component';
import { NotificationModalComponent } from './cmps/notification-modal/notification-modal.component';
import { NotificationComponent } from './cmps/notification/notification.component';
import { NotificationListComponent } from './cmps/notification-list/notification-list.component';
import { StoryListComponent } from './cmps/story-list/story-list.component';
import { StoryPreviewComponent } from './cmps/story-preview/story-preview.component';
import { StoryDetailsComponent } from './cmps/story-details/story-details.component';
import { StoryEditComponent } from './cmps/story-edit/story-edit.component';
import { PaginationBtnsComponent } from './cmps/pagination-btns/pagination-btns.component';
import { StoryTimerComponent } from './cmps/story-timer/story-timer.component';
import { LikeIconComponent } from './cmps/like-icon/like-icon.component';
import { MsgEditComponent } from './cmps/msg-edit/msg-edit.component';
import { QuickReactionComponent } from './cmps/quick-reaction/quick-reaction.component';
import { FileInputComponent } from './cmps/file-input/file-input.component';
import { TxtInputComponent } from './cmps/txt-input/txt-input.component';
import { ColorPickerComponent } from './cmps/color-picker/color-picker.component';
import { FontPickerComponent } from './cmps/font-picker/font-picker.component';
import { PainterSettingsComponent } from './cmps/painter-settings/painter-settings.component';
import { StrokeTypePickerComponent } from './cmps/stroke-type-picker/stroke-type-picker.component';
import { StickerPickerComponent } from './cmps/sticker-picker/sticker-picker.component';
import { ImgListComponent } from './cmps/img-list/img-list.component';
import { OptionModalComponent } from './cmps/option-modal/option-modal.component';
import { StoryCanvasComponent } from './cmps/story-canvas/story-canvas.component';
import { PostCanvasComponent } from './cmps/post-canvas/post-canvas.component';
import { LikeModalComponent } from './cmps/like-modal/like-modal.component';
import { CheckboxComponent } from './cmps/checkbox/checkbox.component';
import { FollowBtnComponent } from './cmps/follow-btn/follow-btn.component';
import { PostOptionsModalComponent } from './cmps/post-options-modal/post-options-modal.component';
import { UserMsgComponent } from './cmps/user-msg/user-msg.component';
import { ConfirmDeleteMsgComponent } from './cmps/confirm-delete-msg/confirm-delete-msg.component';
import { ImgDotsComponent } from './cmps/img-dots/img-dots.component';
import { AspectRatioModalComponent } from './cmps/aspect-ratio-modal/aspect-ratio-modal.component';
import { ZoomModalComponent } from './cmps/zoom-modal/zoom-modal.component';
import { PostFilterPickerComponent } from './cmps/post-filter-picker/post-filter-picker.component';


// Pipes
import { FormattedDatePipe } from './pipes/formatted-date.pipe';
import { ShortTxtPipe } from './pipes/short-txt.pipe';
import { TagPipe } from './pipes/tag.pipe';
import { HomePageHeaderComponent } from './cmps/home-page-header/home-page-header.component';
import { SearchResultsListComponent } from './cmps/search-results-list/search-results-list.component';
import { RecentSearchListComponent } from './cmps/recent-search-list/recent-search-list.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { CommentOptionsModalComponent } from './cmps/comment-options-modal/comment-options-modal.component';
import { SideBarOptionsModalComponent } from './cmps/side-bar-options-modal/side-bar-options-modal.component';
import { StoryComponent } from './cmps/story/story.component';
import { PaginationBtnPrevComponent } from './cmps/pagination-btn-prev/pagination-btn-prev.component';
import { PaginationBtnNextComponent } from './cmps/pagination-btn-next/pagination-btn-next.component';
import { ProfileDetailsHeaderComponent } from './cmps/profile-details-header/profile-details-header.component';
import { ProfileOptionsModalComponent } from './cmps/profile-options-modal/profile-options-modal.component';
import { DiscoverPeopleComponent } from './pages/discover-people/discover-people.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostListComponent,
    PostPreviewComponent,
    SideBarComponent,
    CommentComponent,
    CommentListComponent,
    LoginSignupComponent,
    ShortTxtPipe,
    FormattedDatePipe,
    ShareModalComponent,
    UserListComponent,
    PostEditComponent,
    ImgContainerComponent,
    PostEditFormComponent,
    ExploreComponent,
    MessagesComponent,
    PostDetailsComponent,
    ProfileDetailsComponent,
    UserPreviewComponent,
    EllipsisComponent,
    PostActionsComponent,
    CommentEditComponent,
    ProfileEditComponent,
    SearchBarComponent,
    SearchModalComponent,
    TagPreviewComponent,
    TagDetailsComponent,
    NotificationModalComponent,
    NotificationComponent,
    NotificationListComponent,
    StoryListComponent,
    StoryPreviewComponent,
    StoryDetailsComponent,
    StoryEditComponent,
    PaginationBtnsComponent,
    StoryTimerComponent,
    LikeIconComponent,
    MsgEditComponent,
    QuickReactionComponent,
    FileInputComponent,
    TxtInputComponent,
    ColorPickerComponent,
    FontPickerComponent,
    PainterSettingsComponent,
    StrokeTypePickerComponent,
    StickerPickerComponent,
    ImgListComponent,
    OptionModalComponent,
    StoryCanvasComponent,
    PostCanvasComponent,
    LikeModalComponent,
    CheckboxComponent,
    FollowBtnComponent,
    PostOptionsModalComponent,
    UserMsgComponent,
    ConfirmDeleteMsgComponent,
    ImgDotsComponent,
    AspectRatioModalComponent,
    ZoomModalComponent,
    PostFilterPickerComponent,
    TagPipe,
    HomePageHeaderComponent,
    SearchResultsListComponent,
    RecentSearchListComponent,
    ActivityComponent,
    CommentOptionsModalComponent,
    SideBarOptionsModalComponent,
    StoryComponent,
    PaginationBtnPrevComponent,
    PaginationBtnNextComponent,
    ProfileDetailsHeaderComponent,
    ProfileOptionsModalComponent,
    DiscoverPeopleComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    HammerModule,
    MatProgressBarModule,
    MatSliderModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    EmojiModule,
    AngularDraggableModule,
    AngularSvgIconModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([AppEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: []
})
export class AppModule { }
