import { HttpClient } from '@angular/common/http'
import { UtilService } from './util.service'
import { StorageService } from './storage.service'
import { User, MiniUser } from './../models/user.model'
import {
  BehaviorSubject,
  Observable,
  of,
  map,
  lastValueFrom,
  firstValueFrom,
} from 'rxjs'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { UserState } from '../store/reducers/user.reducer'
import { LoadingUsers } from '../store/actions/user.actions'
import { asyncStorageService } from './async-storage.service'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private store: Store<UserState>,
    private storageService: StorageService,
    private utilService: UtilService,
    private http: HttpClient,
  ) { }

  public getLoggedinUser(): MiniUser | null {
    const loggedinUser =
      this.storageService.loadFromStorage('loggedinUser') || null
    return loggedinUser
  }

  public loadUsers(filterBy = ''): Observable<User[]> {
    this.store.dispatch(new LoadingUsers())
    console.log('UserService: Return Users ===> effect')
    return this.getUsers(filterBy)
  }

  public getUsers(filterBy: string): Observable<User[]> {
    return this.http
      .get(`http://localhost:3030/api/user/search?q=${filterBy}`)
      .pipe(
        map((users) => {
          return users as User[]
        }),
      )
  }

  public getById(userId: string): Observable<User> {
    return this.http.get<User>(`http://localhost:3030/api/user/id/${userId}`)
  }

  public remove(userId: string): Observable<boolean> {
    return this.http.delete(`http://localhost:3030/api/user/${userId}`).pipe(
      map((res) => {
        return true
      }),
    )
  }

  public save(user: User): Observable<User> {
    return this.http.put<User>(`http://localhost:3030/api/user`, user)
  }

  public async login(userCred: { username: string; password: string }) {
    const user = await firstValueFrom(
      this.http.post<User>(`http://localhost:3030/api/auth/login`, userCred),
    )
    if (!user) return
    this.storageService.saveToStorage('loggedinUser', {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      imgUrl: user.imgUrl,
    })
  }

  public async signup(userCred: {
    email: string
    fullname: string
    username: string
    password: string
  }) {
    const addedUser = await lastValueFrom(
      this.http.post<User>(`http://localhost:3030/api/auth/signup`, userCred),
    )
    this.storageService.saveToStorage('loggedinUser', {
      id: addedUser.id,
      fullname: addedUser.fullname,
      username: addedUser.username,
      imgUrl: this.getDefaultUserImgUrl(),
    })
  }

  public async logout() {
    await firstValueFrom(
      this.http.post(`http://localhost:3030/api/auth/logout`, {}),
    )
    this.storageService.saveToStorage('loggedinUser', null)
  }

  public getMiniUser(user: User): MiniUser {
    const { id, fullname, username, imgUrl } = user
    return { id, fullname, username, imgUrl }
  }

  public getEmptyMiniUser(): MiniUser {
    return { id: '', fullname: '', username: '', imgUrl: '' }
  }

  public getDefaultUserImgUrl(): string {
    return 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669376872/user_instagram_sd7aep.jpg'
  }

  public getSnapshotUser(): MiniUser {
    const snapShotUser = {
      id: 'u100',
      username: 'SnapShot',
      fullname: 'SnapShot',
      imgUrl: '../../assets/imgs/logo-blue.png',
    }
    return snapShotUser
  }

  public getFollowers(userId: string): Observable<MiniUser[]> {
    return this.http.get<MiniUser[]>(
      `http://localhost:3030/api/user/followers/${userId}`,
    )
  }

  public async getFollowings(followerId: string): Promise<MiniUser[]> {
    const options = {
      params: {
        followerId,
      }
    }
    return await lastValueFrom(
      this.http.get<MiniUser[]>(
        `http://localhost:3030/api/following`, options
      )
    )
  }

  
}
