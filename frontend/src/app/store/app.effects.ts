import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { UserAction, SAVE_USER, ADDED_USER, UPDATED_USER, LOAD_USERS, LOADED_USERS, REMOVE_USER, REMOVED_USER, LOAD_USER, LOADED_USER, SET_ERROR, LOAD_LOGGEDIN_USER, LOADED_LOGGEDIN_USER } from './actions/user.actions';

@Injectable()
export class AppEffects {

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_USERS),
      switchMap((action) =>
        this.userService.loadUsers(action.filterBy).pipe(
          map((users) => ({
            type: LOADED_USERS,
            users,
          })),
          catchError((error) => {
            console.log('Effect: Caught error ===> Reducer', error)
            return of({
              type: SET_ERROR,
              error: error.toString(),
            })
          })
        )
      )
    );
  });
  loadUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_USER),
      switchMap((action) =>
        this.userService.getById(action.userId).pipe(
          map((user) => ({
            type: LOADED_USER,
            user
          })),
          catchError((error) => {
            console.log('Effect: Caught error ===> Reducer', error)
            return of({
              type: SET_ERROR,
              error: error.toString(),
            })
          })
        )
      ),
    );
  });
  loadLoggedinUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_LOGGEDIN_USER),
      switchMap((action) =>
        this.userService.getById(action.userId).pipe(
          map((user) => ({
            type: LOADED_LOGGEDIN_USER,
            user
          })),
          catchError((error) => {
            console.log('Effect: Caught error ===> Reducer', error)
            return of({
              type: SET_ERROR,
              error: error.toString(),
            })
          })
        )
      ),
    );
  });
  removeUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(REMOVE_USER),
      switchMap((action) =>
        this.userService.remove(action.userId).pipe(
          map(() => ({
            type: REMOVED_USER,
            userId: action.userId,
          })),
          catchError((error) => {
            console.log('Effect: Caught error ===> Reducer', error)
            return of({
              type: SET_ERROR,
              error: error.toString(),
            })
          })
        )
      ),
    );
  })
  saveUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SAVE_USER),
      switchMap((action) =>
        this.userService.update(action.user).pipe(
          map((savedUser) => ({
            type: (action.user.id) ? UPDATED_USER : ADDED_USER,
            user: savedUser,
          })),
          catchError((error) => {
            console.log('Effect: Caught error ===> Reducer', error)
            return of({
              type: SET_ERROR,
              error: error.toString(),
            })
          })

        )
      )
    );
  })
  constructor(
    private actions$: Actions<UserAction>,
    private userService: UserService
  ) { }
}
