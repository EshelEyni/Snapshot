import { inject, Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Post } from '../models/post.model';
import { PostService } from '../services/post.service';

@Injectable({
  providedIn: 'root'
})
export class PostResolver implements Resolve<Observable<void | Post>>{
  postService = inject(PostService)
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params['id']
    return this.postService.getById(id)
  }
}
