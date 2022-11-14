import { UtilService } from './util.service';
import { StorageService } from './storage.service';
import { User, MiniUser, UserFilter } from './../models/user.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

const USERS = [
  {
    _id: 'a12F34b907',
    username: 'tale',
    fullname: 'Tal Hemo',
    email: 'tal@gmail.com',
    password: 'tale123',
    imgUrl: '',
    followers: [],
    following: [],
    savedPostsIds: [],
    savedStoriesIds: []
  },
  {
    _id: 'a12tgeko907',
    username: 'eshel',
    fullname: 'Eshel Eyni',
    email: 'eshel@gmail.com',
    password: 'eshel123',
    imgUrl: '',
    followers: [],
    following: [],
    savedPostsIds: [],
    savedStoriesIds: []
  }
]

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storageService: StorageService,
    private utilService: UtilService) { }

  private _usersDb: User[] = USERS;

  private _users$ = new BehaviorSubject<User[]>([])
  public users$ = this._users$.asObservable()

  private _loggedinUser$ = new BehaviorSubject<MiniUser | null>(null)
  public loggedinUser$ = this._loggedinUser$.asObservable()

  private _filterBy$ = new BehaviorSubject<UserFilter>({ term: '' });
  public filterBy$ = this._filterBy$.asObservable()

  public getLoggedinUser(): Observable<MiniUser | null> {
    const loggedinUser = this.storageService.loadFromStorage('loggedinUser') || null
    return of(loggedinUser)
  }

  public loadUsers(): void {
    let users = this.storageService.loadFromStorage('user') || null
    if (!users) {
      users = this._usersDb;
      this.storageService.saveToStorage('user', users)
    }
    this._users$.next(users)
  }

  public setFilter(filterBy: UserFilter) {
    this._filterBy$.next(filterBy)
    this.loadUsers()
  }

  public login(userCred: { username: string, password: string }) {
    const users = this.storageService.loadFromStorage('user') || []
    const userIdx = users.findIndex((user: User) => user.username === userCred.username)

    if (userIdx !== -1 && users[userIdx].password === userCred.password) {
      const user = { _id: users[userIdx]._id, fullname: users[userIdx].fullname, username: users[userIdx].username, imgUrl: users[userIdx].imgUrl }
      this.storageService.saveToStorage('loggedinUser', user)
      this._loggedinUser$.next(user)
    }
  }

  public signup(userCred: { email: string, fullname: string, username: string, password: string }) {
    const users = this.storageService.loadFromStorage('user') || []

    const user: User = {
      _id: this.utilService.makeId(),
      email: userCred.email,
      fullname: userCred.fullname,
      username: userCred.username,
      password: userCred.password,
      imgUrl: '',
      followers: [],
      following: [],
      savedPostsIds: [],
      savedStoriesIds: [],
    }

    users.push(user)
    this.storageService.saveToStorage('loggedinUser', { _id: user._id, fullname: user.fullname, username: user.username, imgUrl: user.imgUrl })
    this.storageService.saveToStorage('user', users)
    this._users$.next(users)
    this._loggedinUser$.next(user)
  }

  public logout() {
    this.storageService.saveToStorage('loggedinUser', null)
    this._loggedinUser$.next(null)
  }

  public getUserById(userId: string): Observable<User> {
    const users = this.storageService.loadFromStorage('user') || []
    const user = users.find((user: User) => user._id === userId)
    return of(user)
  }

  public updateUser(user: User) {
    const users = this.storageService.loadFromStorage('user') || []
    const userIdx = users.findIndex((currUser: User) => currUser._id === user._id)
    users.splice(userIdx, 1, user)
    this.storageService.saveToStorage('user', users)
    this._users$.next(users)
  }
}

