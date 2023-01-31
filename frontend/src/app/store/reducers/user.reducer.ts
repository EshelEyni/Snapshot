import { SET_LOADING, LOADED_USERS, LOADED_LOGGEDIN_USER, REMOVED_USER, ADDED_USER, UPDATED_USER, LOADED_USER, SET_ERROR } from '../actions/user.actions';
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
      return { ...state, isLoading, error: '' };
    }
    case SET_ERROR: {
      const { error } = action;
      return { ...state, error, isLoading: false };
    }
    case LOADED_USERS: {
      const { users } = action;
      return { ...state, users, isLoading: false, error: '' };
    }
    case LOADED_USER: {
      const { user } = action;
      return { ...state, user, error: '' };
    }
    case LOADED_LOGGEDIN_USER: {
      const { user } = action;
      return { ...state, loggedinUser: user, error: '' };
    }
    case REMOVED_USER: {
      const { userId } = action;
      const users = state.users.filter(user => user.id !== userId)
      return { ...state, users, error: '' };
    }
    case ADDED_USER: {
      const { user } = action;
      const users = [...state.users, user]
      return { ...state, users, error: '' };
    }
    case UPDATED_USER: {
      const { user } = action;
      const users = state.users.map(currUser => (currUser.id === user.id) ? user : currUser)
      const loggedinUser = (state.loggedinUser && state.loggedinUser.id === user.id) ? user : state.loggedinUser;
      return { ...state, users, user: null, loggedinUser, error: '' };
    }
    default:
      return state;
  }
}