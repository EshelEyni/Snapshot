import { StorageService } from './storage.service';
import { User, miniUser, UserFilter } from './../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

const USERS = [
  {
    id: 'a12F34b907',
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
    id: 'a12tgeko907',
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

  constructor(private storageService: StorageService) { }

  private _usersDb: User[] = USERS;

  private _users$ = new BehaviorSubject<User[]>([])
  public users$ = this._users$.asObservable()

  private _loggedinUser$ = new BehaviorSubject<miniUser | null>(null)
  public loggedinUser$ = this._loggedinUser$.asObservable()

  private _filterBy$ = new BehaviorSubject<UserFilter>({ term: '' });
  public filterBy$ = this._filterBy$.asObservable()

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
}
