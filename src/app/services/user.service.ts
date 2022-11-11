import { User, miniUser } from './../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private _users$ = new BehaviorSubject<User[]>([])
  public users$ = this._users$.asObservable()

  private _loggedinUser$ = new BehaviorSubject<miniUser | null>(null)
  public loggedinUser$ = this._loggedinUser$.asObservable()
}
