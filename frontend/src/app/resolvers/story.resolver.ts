import { StoryService } from './../services/story.service';
import { Story } from './../models/story.model';
import { Injectable, inject } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoryResolver implements Resolve<Observable<void | Story>> {
  storyService = inject(StoryService);
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params['id'];
    return this.storyService.getById(id);
  };
};