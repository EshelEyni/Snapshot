import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app-root/app.component';
import { HomeComponent } from './pages/home/home.component';
import { PostAppComponent } from './cmps/post-app/post-app.component';
import { PostListComponent } from './cmps/post-list/post-list.component';
import { PostPreviewComponent } from './cmps/post-preview/post-preview.component';
import { SideBarComponent } from './cmps/side-bar/side-bar.component';
import { CommentComponent } from './cmps/comment/comment.component';
import { CommentListComponent } from './cmps/comment-list/comment-list.component';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { ShortTxtPipe } from './pipes/short-txt.pipe';
import { FormattedDatePipe } from './pipes/formatted-date.pipe';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiPickerComponent } from './cmps/emoji-picker/emoji-picker.component';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

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
    EmojiPickerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    PickerModule,
    EmojiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
