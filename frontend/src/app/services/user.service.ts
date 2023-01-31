import { HttpClient } from '@angular/common/http'
import { StorageService } from './storage.service'
import { User, MiniUser } from './../models/user.model'
import { Observable, of, map, lastValueFrom, firstValueFrom } from 'rxjs'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { UserState } from '../store/reducers/user.reducer'
import { LoadingUsers } from '../store/actions/user.actions'
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})

export class UserService {

  constructor(
    private store: Store<UserState>,
    private storageService: StorageService,
    private http: HttpClient,
    private httpService: HttpService,
  ) { };

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl();

  public getLoggedinUser(): MiniUser | null {
    const loggedinUser =
      this.storageService.loadFromStorage('loggedinUser') || null;
    return loggedinUser;
  };

  public loadUsers(filterBy: { userId: number, type: string, limit: number }): Observable<User[]> {
    this.store.dispatch(new LoadingUsers());
    return this.getUsers(filterBy);
  };

  public getUsers(filterBy: { userId: number, type: string, limit: number }): Observable<User[]> {
    let options = {}
    if (filterBy) {
      options = {
        params: {
          type: filterBy.type,
          limit: filterBy.limit,
          userId: filterBy.userId
        }
      };
    };

    return this.http
      .get(`${this.baseUrl}/user`, options)
      .pipe(
        map((users) => {
          return users as User[];
        }),
      );
  };

  public getUsersBySearchTerm(searchTerm: string): Observable<User[]> {
    return this.http
      .get(`${this.baseUrl}/user/search?searchTerm=${searchTerm}`)
      .pipe(
        map((users) => {
          return users as User[]
        }),
      );
  };

  public getById(userId: number): Observable<User | null> {
    if (userId) return this.http.get<User>(`${this.baseUrl}/user/id/${userId}`);
    else return of(null);
  };

  public remove(userId: number): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/user/${userId}`).pipe(
      map((res) => {
        return true;
      }),
    );
  };

  public update(user: User): Observable<User> {
    return this.http.put(`${this.baseUrl}/user`, user) as unknown as Observable<User>;
  };


  public async checkPassword(newPassword: string, password: string, userId: number): Promise<string> {
    const options = {
      params: {
        newPassword,
        password,
        userId
      }
    };
    const res: { hashedPassword: string } = await lastValueFrom(
      this.http.get<{ hashedPassword: string }>(
        `${this.baseUrl}/user/check-password`, options
      )
    );
    return res.hashedPassword;
  };

  public async checkIfUsernameTaken(username: string): Promise<boolean> {
    const options = { withCredentials: true };
    const trimmedUsername = username.trim();
    const res: { chekIfUsernameTaken: boolean } = await lastValueFrom(
      this.http.get<{ chekIfUsernameTaken: boolean }>(
        `${this.baseUrl}/user/check-username/${trimmedUsername}`, options
      )
    );
    return res.chekIfUsernameTaken;
  };

  public getMiniUser(user: User): MiniUser {
    const { id, fullname, username, imgUrl } = user;
    return { id, fullname, username, imgUrl };
  };

  public getEmptyMiniUser(): MiniUser {
    return { id: 0, fullname: '', username: '', imgUrl: '' };
  };

  public getDefaultUserImgUrl(): string {
    return 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669376872/user_instagram_sd7aep.jpg';
  }

  public async getFollowers(followingId: number): Promise<MiniUser[] | []> {
    const options = { params: { followingId } };

    return await lastValueFrom(
      this.http.get<MiniUser[]>(`${this.baseUrl}/followers`, options)
    );
  };

  public async getFollowings(followerId: number): Promise<MiniUser[]> {
    const options = { params: { followerId } };

    return await lastValueFrom(
      this.http.get<MiniUser[]>(`${this.baseUrl}/following`, options)
    );
  };

  public async checkIsFollowing(loggedinUserId: number, userToCheckId: number): Promise<boolean> {
    const options = { params: { followerId: loggedinUserId, userToCheckId } };

    const isFollowing = await lastValueFrom(
      this.http.get(`${this.baseUrl}/following`, options)
    ) as Array<any>;
    return isFollowing.length > 0;
  };

  public async toggleFollow(isFollowing: boolean, loggedinUser: MiniUser, user: MiniUser): Promise<void> {
    if (isFollowing) {
      await firstValueFrom(
        this.http.delete(`${this.baseUrl}/following`, { body: { followerId: loggedinUser.id, userId: user.id } })
      );
      await firstValueFrom(
        this.http.delete(`${this.baseUrl}/followers`, { body: { followingId: user.id, userId: loggedinUser.id } })
      );

    } else {
      const following = {
        followerId: loggedinUser.id,
        userId: user.id,
        username: user.username,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
      }

      await firstValueFrom(this.http.post(`${this.baseUrl}/following`, following));

      const follower = {
        followingId: user.id,
        userId: loggedinUser.id,
        username: loggedinUser.username,
        fullname: loggedinUser.fullname,
        imgUrl: loggedinUser.imgUrl,
      }

      await firstValueFrom(this.http.post(`${this.baseUrl}/followers`, follower));
    };
  };
};