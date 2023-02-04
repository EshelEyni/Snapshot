import { Action } from '@ngrx/store';
import { User } from 'src/app/models/user.model';

export const SET_LOADING = '[user] loading';
export const SET_ERROR = '[user] error';
export const LOAD_USERS = '[user]s load';
export const LOADED_USERS = '[user]s loaded';
export const LOAD_USER = '[user] load';
export const LOADED_USER = '[user] loaded';
export const REMOVE_USER = '[user] remove';
export const REMOVED_USER = '[user] removed';
export const SAVE_USER = '[user] saved';
export const ADDED_USER = '[user] added';
export const UPDATED_USER = '[user] updated';
export const LOAD_LOGGEDIN_USER = '[loggedin user] load';
export const LOADED_LOGGEDIN_USER = '[loggedin user] loaded';

export type UserAction = LoadUsers | LoadUser | LoadLoggedInUser | RemoveUser | SaveUser

export class LoadUsers implements Action {
  readonly type = LOAD_USERS;
  constructor(public filterBy: { userId: number, type: string, limit: number }) { }
}
export class LoadUser implements Action {
  readonly type = LOAD_USER;
  constructor(public userId: number = 0) { }
}
export class LoadLoggedInUser implements Action {
  readonly type = LOAD_LOGGEDIN_USER;
  constructor(public userId: number = 0) { }
}
export class RemoveUser implements Action {
  readonly type = REMOVE_USER;
  constructor(public userId: number) { }
}
export class LoadedUsers implements Action {
  readonly type = LOADED_USERS;
  constructor(public users: User[] = []) { }
}
export class LoadedUser implements Action {
  readonly type = LOADED_USER;
  constructor(public user: User) { }
}
export class LoadedLoggedInUser implements Action {
  readonly type = LOADED_LOGGEDIN_USER;
  constructor(public user: User | null) { }
}
export class RemovedUser implements Action {
  readonly type = REMOVED_USER;
  constructor(public userId: number) { }
}
export class SaveUser implements Action {
  readonly type = SAVE_USER;
  constructor(public user: User) { }
}
export class AddedUser implements Action {
  readonly type = ADDED_USER;
  constructor(public user: User) { }
}
export class UpdatedUser implements Action {
  readonly type = UPDATED_USER;
  constructor(public user: User) { }
}
export class LoadingUsers implements Action {
  readonly type = SET_LOADING;
  constructor(public isLoading: boolean = true) { }
}
export class UserError implements Action {
  readonly type = SET_ERROR;
  constructor(public error: string) { }
}

