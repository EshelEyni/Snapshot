import { HttpClient } from '@angular/common/http';
import { PostService } from './post.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { UtilService } from './util.service';
import { BehaviorSubject, Observable, throwError, of, map, lastValueFrom } from 'rxjs';
import { Tag } from '../models/tag.model';
import { Injectable, inject } from '@angular/core';
import { asyncStorageService } from './async-storage.service';

const TAGS = [
  {
    id: '648487',
    name: '#Angular',
    postsIds: ['1', '2'],
  }
]

const ENTITY = 'tag';

@Injectable({
  providedIn: 'root'
})

export class TagService {

  private _tagsDb: Tag[] = TAGS;
  private _tags$ = new BehaviorSubject<Tag[]>([]);
  public tags$ = this._tags$.asObservable();

  constructor() { }

  utilService = inject(UtilService);
  userSerivce = inject(UserService);
  storageService = inject(StorageService);
  postService = inject(PostService);
  http = inject(HttpClient);

  public async loadTags(filterBy = { name: '' }) {
    const tags = await lastValueFrom(this.getTags(filterBy));
    this._tags$.next(tags);
  }

  public getTags(filterBy = { name: '' }): Observable<Tag[]> {
    let options = { params: {} }
    if (filterBy) {
      options.params = {
        name: filterBy.name,
      }
    }

    return this.http.get<Tag[]>('http://localhost:3030/api/tag', options);
  }

  public getById(tagId: string): Observable<Tag> {
    let tags = this.storageService.loadFromStorage(ENTITY)
    const tag = tags.find((tag: Tag) => tag.id === tagId)
    return tag ? of(tag) : throwError(() => `Tag id ${tagId} not found!`)
  }

  public remove(tagId: string) {
    let tags = this.storageService.loadFromStorage(ENTITY)
    tags = tags.filter((tag: Tag) => tag.id !== tagId)
    this._tags$.next([...tags])
    this.storageService.saveToStorage(ENTITY, tags)
  }

  public save(tag: Tag) {
    return tag.id ? this._update(tag) : this._add(tag)
  }

  private async _update(tag: Tag) {
    await asyncStorageService.put(ENTITY, tag) as Tag
    this.loadTags()
  }

  private async _add(tag: Tag) {
    const addedTag = await asyncStorageService.post(ENTITY, tag) as Tag
    this.loadTags()
    return addedTag.id
  }

}
