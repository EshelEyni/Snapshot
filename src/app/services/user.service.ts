import { UtilService } from './util.service';
import { StorageService } from './storage.service';
import { User, MiniUser, UserFilter } from './../models/user.model';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserState } from '../store/reducers/user.reducer';
import { LoadingUsers } from '../store/actions/user.actions';
import { asyncStorageService } from './async-storage.service';

const USERS:User[] = [
  {
    id: 'a12F34b907',
    username: 'tale',
    fullname: 'Tal Hemo',
    gender:'female',
    email: 'tal@gmail.com',
    phone: '054-1234567',
    password: 'tale123',
    bio: 'I am a full stack developer',
    website: 'https://talehemo.com',
    imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664955076/ifizwgsan7hjjovf2xtn.jpg',
    followers: [],
    following: [],
    createdPostsIds: [],
    savedPostsIds: ['1', '2'],
    savedStoriesIds: []
  },
  {
    id: 'a12tgeko907',
    username: 'eshel',
    fullname: 'Eshel Eyni',
    gender:'male',
    email: 'eshel@gmail.com',
    phone: '054-1234567',
    password: 'eshel123',
    bio: 'I am a full stack developer',
    website: 'https://eshel.com',
    imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1669304308/lci872dhvwd0jeuzh3h8.png',
    followers: [],
    following: [],
    createdPostsIds: [],
    savedPostsIds: [],
    savedStoriesIds: []
  }
]

const ENTITY = 'user'

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(
    private store: Store<UserState>,
    private storageService: StorageService,
    private utilService: UtilService
  ) {
    const users = this.storageService.loadFromStorage(ENTITY) || null;
    if (!users || users.length === 0) this.storageService.saveToStorage(ENTITY, USERS)
  }

  public getLoggedinUser(): MiniUser | null {
    const loggedinUser = this.storageService.loadFromStorage('loggedinUser') || null
    return loggedinUser
  }

  public loadUsers(filterBy = ''): Observable<User[]> {
    this.store.dispatch(new LoadingUsers());
    console.log('ItemService: Return Items ===> effect');
    return from(asyncStorageService.query(ENTITY) as Promise<User[]>)
  }

  public getById(userId: string): Observable<User> {
    return from(asyncStorageService.get(ENTITY, userId) as Promise<User>)
    // return from(axios.get(URL + itemId) as Promise<Item>)
  }

  public remove(userId: string): Observable<boolean> {
    return from(asyncStorageService.remove(ENTITY, userId))
  }

  public save(user: User): Observable<User> {
    const method = (user.id) ? 'put' : 'post'
    const prmSavedItem = asyncStorageService[method](ENTITY, user)
    return from(prmSavedItem) as Observable<User>
  }

  public login(userCred: { username: string, password: string }) {
    const users = this.storageService.loadFromStorage(ENTITY) || []
    const userIdx = users.findIndex((user: User) => user.username === userCred.username)

    if (userIdx !== -1 && users[userIdx].password === userCred.password) {
      const { id, fullname, username, imgUrl } = users[userIdx]
      const user = { id, fullname, username, imgUrl }
      this.storageService.saveToStorage('loggedinUser', user)
    }
  }

  public signup(userCred: { email: string, fullname: string, username: string, password: string }) {
    const users = this.storageService.loadFromStorage('user') || []

    const user: User = {
      id: this.utilService.makeId(),
      email: userCred.email,
      fullname: userCred.fullname,
      username: userCred.username,
      password: userCred.password,
      gender: '',
      phone: '',
      website: '',
      bio:'',
      imgUrl: '',
      followers: [],
      following: [],
      createdPostsIds: [],
      savedPostsIds: [],
      savedStoriesIds: [],
    }

    users.push(user)
    this.storageService.saveToStorage('loggedinUser', { id: user.id, fullname: user.fullname, username: user.username, imgUrl: user.imgUrl })
    this.storageService.saveToStorage('user', users)
  }

  public logout() {
    this.storageService.saveToStorage('loggedinUser', null)
  }

  public async savePostToUser(userId: string, postId: string) {
    const user = await asyncStorageService.get(ENTITY, userId) as User
    if (user) {
      user.createdPostsIds.push(postId)
      asyncStorageService.put(ENTITY, user)
    }
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
}