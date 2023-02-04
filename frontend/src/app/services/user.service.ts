import { HttpClient } from '@angular/common/http'
import { StorageService } from './storage.service'
import { User, MiniUser } from './../models/user.model'
import { Observable, of, map, lastValueFrom } from 'rxjs'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { UserState } from '../store/reducers/user.reducer'
import { LoadingUsers } from '../store/actions/user.actions'
import { HttpService } from './http.service'


@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private store: Store<UserState>,
    private storageService: StorageService,
    private http: HttpClient,
    private httpService: HttpService,
  ) { }

  baseUrl: '/api' | '//localhost:3030/api' = this.httpService.getBaseUrl()


  public getLoggedinUser(): MiniUser | null {
    const loggedinUser =
      this.storageService.loadFromStorage('loggedinUser') || null
    return loggedinUser
  }

  public loadUsers(filterBy: {
    userId: number
    type: string
    limit: number
  }): Observable<User[]> {
    this.store.dispatch(new LoadingUsers())
    return this.getUsers(filterBy)
  }

  public getUsers(filterBy: {
    userId: number
    type: string
    limit: number
  }): Observable<User[]> {

    const options = {
      withCredentials: true,
      params: {
        type: filterBy.type,
        limit: filterBy.limit,
        userId: filterBy.userId,
      },
    }

    return this.http.get(`${this.baseUrl}/user`, options).pipe(
      map((users) => {
        return users as User[]
      }),
    )
  }

  public getUsersBySearchTerm(searchTerm: string): Observable<User[]> {
    const options = {
      withCredentials: true,
    }
    return this.http
      .get(`${this.baseUrl}/user/search?searchTerm=${searchTerm}`, options)
      .pipe(
        map((users) => {
          return users as User[]
        })
      )
  }

  public getById(userId: number): Observable<User | null> {
    const options = {
      withCredentials: true,
    }
      return this.http.get<User>(`${this.baseUrl}/user/id/${userId}`, options)
  }

  public remove(userId: number): Observable<boolean> {
    const options = {
      withCredentials: true
    }
    return this.http.delete(`${this.baseUrl}/user/${userId}`, options).pipe(
      map((res) => {
        return true
      }),
    )
  }

  public update(user: User): Observable<User> {
    const options = {
      withCredentials: true
    }

    return (this.http.put(
      `${this.baseUrl}/user`,
      user, options,
    ) as unknown) as Observable<User>
  }

  public async checkPassword(
    newPassword: string,
    password: string,
    userId: number,
  ): Promise<string> {
    const options = {
      withCredentials: true,
      params: {
        newPassword,
        password,
        userId,
      },
    }
    const res: { hashedPassword: string } = await lastValueFrom(
      this.http.get<{ hashedPassword: string }>(
        `${this.baseUrl}/user/check-password`,
        options,
      ),
    )
    return res.hashedPassword
  }

  public async checkIfUsernameTaken(username: string): Promise<boolean> {
    const options = { withCredentials: true }
    const trimmedUsername = username.trim()
    const res: { chekIfUsernameTaken: boolean } = await lastValueFrom(
      this.http.get<{ chekIfUsernameTaken: boolean }>(
        `${this.baseUrl}/user/check-username/${trimmedUsername}`,
        options,
      ),
    )
    return res.chekIfUsernameTaken
  }

  public getMiniUser(user: User): MiniUser {
    const { id, fullname, username, imgUrl, currStoryId, isStoryViewed } = user
    return { id, fullname, username, imgUrl, currStoryId, isStoryViewed }
  }

  public getEmptyMiniUser(): MiniUser {
    return { id: 0, fullname: '', username: '', imgUrl: '', currStoryId: 0, isStoryViewed: false }
  }

  public getDefaultUserImgUrl(): string {
    return 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669376872/user_instagram_sd7aep.jpg'
  }

}
