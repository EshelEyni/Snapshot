// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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

// Components
import { AppComponent } from './app-root/app.component';
import { HomeComponent } from './pages/home/home.component';
import { PostAppComponent } from './cmps/post-app/post-app.component';
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

// Pipes
import { CommentsToDisplayPipe } from './pipes/comments-to-display.pipe';
import { FormattedDatePipe } from './pipes/formatted-date.pipe';
import { ShortTxtPipe } from './pipes/short-txt.pipe';
import { ProfileDetailsComponent } from './pages/profile-details/profile-details.component';
import { UserPreviewComponent } from './cmps/user-preview/user-preview.component';
import { EllipsisComponent } from './cmps/ellipsis/ellipsis.component';
import { PostActionsComponent } from './cmps/post-actions/post-actions.component';
import { CommentEditComponent } from './cmps/comment-edit/comment-edit.component';
import { SideBarIconDirective } from './directives/side-bar-icon.directive';
import { NotificationsModalComponent } from './cmps/notifications-modal/notifications-modal.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { SearchBarComponent } from './cmps/search-bar/search-bar.component';
import { SearchModalComponent } from './cmps/search-modal/search-modal.component';
import { TagPreviewComponent } from './cmps/tag-preview/tag-preview.component';
import { TagDetailsComponent } from './pages/tag-details/tag-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostAppComponent,
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
    CommentsToDisplayPipe,
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
    SideBarIconDirective,
    NotificationsModalComponent,
    ProfileEditComponent,
    SearchBarComponent,
    SearchModalComponent,
    TagPreviewComponent,
    TagDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    EmojiModule,
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
    EffectsModule.forRoot([AppEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
