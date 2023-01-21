import { HttpClient } from '@angular/common/http';
import { PostService } from './post.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { UtilService } from './util.service';
import { BehaviorSubject, Observable, throwError, of, map, lastValueFrom, firstValueFrom } from 'rxjs';
import { Tag } from '../models/tag.model';
import { Injectable, inject } from '@angular/core';

const TAGS = [
  {
    id: 648487,
    name: '#Angular',
    postIds: ['1', '2'],
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

  public getByName(tagName: string): Observable<Tag> {
    return this.http.get<Tag>(`http://localhost:3030/api/tag/${tagName}`);
  }

  public remove(tagId: string) {
    return this.http.delete(`http://localhost:3030/api/tag/${tagId}`);
  }

  public save(tag: Tag) {
    return tag.id ? this._update(tag) : this._add(tag)
  }

  private async _update(tag: Tag) {
    return firstValueFrom(
      this.http.put(`http://localhost:3030/api/tag/${tag.id}`, tag)
    );
  }

  private async _add(tag: Tag): Promise<number | void> {
    const res = await firstValueFrom(
      this.http.post(`http://localhost:3030/api/tag`, tag)
    ) as { msg: string, id: number }

    if (res.msg === 'Tag added') {
      return res.id;
    } else {
      return;
    }
  }


  public detectTags(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = text.match(hashtagRegex);
    const tags: string[] = [];
    if (hashtags) {
      hashtags.forEach((hashtag) => {
        const tag = hashtag.substring(1);
        tags.push(tag);
      });
    }
    return tags;
  }

}