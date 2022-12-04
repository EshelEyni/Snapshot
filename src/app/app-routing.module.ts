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

const routes: Routes = [
  { path: 'login', component: LoginSignupComponent },
  { path: 'signup', component: LoginSignupComponent },
  { path: 'profile/:id', component: ProfileDetailsComponent, resolve: { user: UserResolver } },
  { path: 'profile-edit/:id', component: ProfileEditComponent, resolve: { user: UserResolver } },
  { path: 'post/:id', component: PostDetailsComponent, resolve: { post: PostResolver } },
  { path: 'tag/:id', component: TagDetailsComponent, resolve: { tag: TagResolver } },
  { path: 'explore', component: ExploreComponent },
  { path: 'inbox', component: MessagesComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
