import { CookieService } from 'ngx-cookie-service';
import { MiniUser } from './../models/user.model';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor() { }
  httpService = inject(HttpService)
  http = inject(HttpClient)
  cookieService = inject(CookieService)

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl()


  public async getFollowers(): Promise<MiniUser[] | []> {
    const options = {
      withCredentials: true
    }

    return await lastValueFrom(
      this.http.get<MiniUser[]>(`${this.baseUrl}/follow/followers`, options),
    )
  }

  public async getFollowings(): Promise<MiniUser[]> {
    const options = {
      withCredentials: true,
    }

    return await lastValueFrom(
      this.http.get<MiniUser[]>(`${this.baseUrl}/follow/followings`, options),
    )
  }

  public async checkIsFollowing(
    loggedinUserId: number,
    userToCheckId: number,
  ): Promise<boolean> {
    const options = {
      withCredentials: true,
    }

    const isFollowing = (await lastValueFrom(
      this.http.get(`${this.baseUrl}/follow/is-following/${userToCheckId}`, options),
    )) as boolean

    return isFollowing
  }

  public async toggleFollow(
    isFollowing: boolean,
    user: MiniUser,
  ): Promise<void> {

    const options = {
      withCredentials: true,
      
    }

    if (isFollowing) {
      await lastValueFrom(this.http.delete(`${this.baseUrl}/follow/${user.id}`, options))
    }
    else {
      await lastValueFrom(this.http.post(`${this.baseUrl}/follow/${user.id}`,null, options))
    }
  }
}
