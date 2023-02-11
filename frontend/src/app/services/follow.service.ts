import { MiniUser } from './../models/user.model';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  constructor() {}
  httpService = inject(HttpService);
  http = inject(HttpClient);

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl();

  public async getFollowings(userId: number): Promise<MiniUser[]> {
    const options = {
      withCredentials: true,
    };

    return await lastValueFrom(
      this.http.get<MiniUser[]>(
        `${this.baseUrl}/follow/followings/${userId}`,
        options
      )
    );
  }

  public async getFollowers(userId: number): Promise<MiniUser[] | []> {
    const options = {
      withCredentials: true,
    };

    return await lastValueFrom(
      this.http.get<MiniUser[]>(
        `${this.baseUrl}/follow/followers/${userId}`,
        options
      )
    );
  }

  public async toggleFollow(
    isFollowing: boolean,
    user: MiniUser
  ): Promise<void> {
    const options = {
      withCredentials: true,
    };

    if (isFollowing) {
      await lastValueFrom(
        this.http.delete(`${this.baseUrl}/follow/${user.id}`, options)
      );
    } else {
      await lastValueFrom(
        this.http.post(`${this.baseUrl}/follow/${user.id}`, null, options)
      );
    }
  }
}
