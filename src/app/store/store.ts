import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as userModule from './reducers/user.reducer';

import { environment } from '../../environments/environment';

export interface State {
  userState: userModule.UserState;
}

export const reducers: ActionReducerMap<State> = {
  userState: userModule.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];
