import { Tag } from '../models/tag.model';
import { TagService } from './../services/tag.service';
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
export class TagResolver implements Resolve<Observable<void | Tag>> {
  tagService = inject(TagService)
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const id = route.params['id']
    return this.tagService.getById(id)
  }
}
