import { ActivityComponent } from './pages/activity/activity.component';
import { StoryEditComponent } from './cmps/story-edit/story-edit.component';
import { StoryDetailsComponent } from './cmps/story-details/story-details.component';
import { TagResolver } from './resolvers/tag.resolver';
import { TagDetailsComponent } from './pages/tag-details/tag-details.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { UserResolver } from './resolvers/user.resolver';
import { PostDetailsComponent } from './pages/post-details/post-details.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { ProfileDetailsComponent } from './pages/profile-details/profile-details.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostResolver } from './resolvers/post.resolver';
import { AuthGuard } from './guards/auth.guard';
import { StoryResolver } from './resolvers/story.resolver';

const routes: Routes = [
  { path: 'login', component: LoginSignupComponent },
  { path: 'signup', component: LoginSignupComponent },
  { path: 'profile/:id', component: ProfileDetailsComponent, resolve: { user: UserResolver }, canActivate: [AuthGuard] },
  { path: 'profile-edit/:id', component: ProfileEditComponent, resolve: { user: UserResolver }, canActivate: [AuthGuard] },
  { path: 'post/:id', component: PostDetailsComponent, resolve: { post: PostResolver }, canActivate: [AuthGuard] },
  { path: 'tag/:name', component: TagDetailsComponent, resolve: { tag: TagResolver }, canActivate: [AuthGuard] },
  { path: 'story/:id', component: StoryDetailsComponent, resolve: { story: StoryResolver }, canActivate: [AuthGuard] },
  { path: 'story-edit', component: StoryEditComponent, canActivate: [AuthGuard] },
  {
    path: 'explore', component: ExploreComponent, canActivate: [AuthGuard], children: [
      { path: '_/post/:id', component: PostDetailsComponent, resolve: { post: PostResolver }, data: { isNested: true, isExplorePage: true } },
    ]
  },
  { path: 'inbox', component: MessagesComponent, canActivate: [AuthGuard] },
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: '_/post/:id', component: PostDetailsComponent, resolve: { post: PostResolver }, data: { isNested: true } },
    ]
  },
  { path: 'activity', component: ActivityComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
