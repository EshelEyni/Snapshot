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

const USERS: User[] = [
  {
    id: 'a12F34b907',
    username: 'tale',
    fullname: 'Tal Hemo',
    gender: 'female',
    email: 'tal@gmail.com',
    phone: '054-1234567',
    password: 'tale123',
    bio: 'I am a full stack developer',
    website: 'https://talehemo.com',
    imgUrl:
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg',
    followersSum: 0,
    followingSum: 0,
    postSum: 0,
    currStoryId: '2134',
  },
  {
    id: 'a12tgeko907',
    username: 'eshel',
    fullname: 'Eshel Eyni',
    gender: 'male',
    email: 'eshel@gmail.com',
    phone: '054-1234567',
    password: 'eshel123',
    bio: 'I am a full stack developer',
    website: 'https://eshel.com',
    imgUrl:
      'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669304308/lci872dhvwd0jeuzh3h8.png',
    followersSum: 0,
    followingSum: 0,
    postSum: 0,
    currStoryId: '',
  },
]

const ENTITY = 'user'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private store: Store<UserState>,
    private storageService: StorageService,
    private utilService: UtilService,
    private http: HttpClient,
  ) {
    const users = this.storageService.loadFromStorage(ENTITY) || null
    if (!users || users.length === 0)
      this.storageService.saveToStorage(ENTITY, USERS)
  }

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
    return this.http.get(`http://localhost:3030/api/user/${filterBy}`).pipe(
      map((users) => {
        return users as User[]
      }),
    )
  }

  public getById(userId: string): Observable<User> {
    return this.http.get(`http://localhost:3030/api/user/${userId}`).pipe(
      map((user) => {
        return user as User
      }),
    )
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
}
