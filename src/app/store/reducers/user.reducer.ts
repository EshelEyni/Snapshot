import { SET_LOADING, LOADED_USERS,LOADED_LOGGEDIN_USER, REMOVED_USER, ADDED_USER, UPDATED_USER, LOADED_USER, SET_ERROR } from '../actions/user.actions';
import { User } from 'src/app/models/user.model';

export interface UserState {
  users: User[];
  user: User | null;
  loggedinUser: User | null;
  isLoading: boolean;
  error: string;
}

const initialState: UserState = {
  users: [],
  user: null,
  loggedinUser: null,
  isLoading: false,
  error: ''
};

export function reducer(state: UserState = initialState, action: any): UserState {
  switch (action.type) {
    case SET_LOADING: {
      const { isLoading } = action;
      console.log(`Reducer: Setting isLoading to ${isLoading}`);
      return { ...state, isLoading, error: '' };
    }
    case SET_ERROR: {
      const { error } = action;
      console.log(`Reducer: Setting user error`, error);
      return { ...state, error, isLoading: false };
    }
    case LOADED_USERS: {
      const { users } = action;
      console.log(`Reducer: Setting loaded users (${users.length}) users`);
      return { ...state, users, isLoading: false, error: '' };
    }
    case LOADED_USER: {
      const { user } = action;
      console.log(`Reducer: Setting loaded user ${user.id}`);
      return { ...state, user, error: '' };

    }
    case LOADED_LOGGEDIN_USER: {
      const { user } = action;
      console.log(`Reducer: Setting loaded loggedin user ${user.id}`);
      return { ...state, loggedinUser: user, error: '' };
    }
    case REMOVED_USER: {
      const { userId } = action;
      console.log('Reducer: Removing user:', userId);
      const users = state.users.filter(user => user.id !== userId)
      return { ...state, users, error: '' };

    }
    case ADDED_USER: {
      const { user } = action;
      console.log('Reducer: Adding user:', user);
      const users = [...state.users, user]
      return { ...state, users, error: '' };
    }
    case UPDATED_USER: {
      const { user } = action;
      console.log('Reducer: Updating user:', user);
      const users = state.users.map(currUser => (currUser.id === user.id) ? user : currUser)
      return { ...state, users, user: null, error: '' };
    }
    default:
      return state;
  }
}
