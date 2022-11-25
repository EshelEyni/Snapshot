import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { UserAction, SAVE_USER, ADDED_USER, UPDATED_USER, LOAD_USERS, LOADED_USERS, REMOVE_USER, REMOVED_USER, LOAD_USER, LOADED_USER, SET_ERROR, LOAD_LOGGEDIN_USER, LOADED_LOGGEDIN_USER } from './actions/user.actions';

// Nice way to test error handling? localStorage.clear() after users are presented 
@Injectable()
export class AppEffects {

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOAD_USERS),
      tap(() => console.log('Effects: load users ==> service')),
      switchMap((action) =>
        this.userService.loadUsers(action.filterBy).pipe(
          tap(() => console.log('Effects: Got users from service, send it to ===> Reducer')),
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
      tap(() => console.log('Effects: load user ==> service')),
      switchMap((action) =>
        this.userService.getById(action.userId).pipe(
          tap(() => console.log('Effects: Got user from service ===> Reducer')),
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
      tap(() => console.log('Effects: load user ==> service')),
      switchMap((action) =>
        this.userService.getById(action.userId).pipe(
          tap(() => console.log('Effects: Got user from service ===> Reducer')),
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
          tap(() => console.log('Effects: User removed by service ===> Reducer')),
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
        this.userService.save(action.user).pipe(
          tap(() => console.log('Effects: User saved by service, inform the ===> Reducer')),
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
