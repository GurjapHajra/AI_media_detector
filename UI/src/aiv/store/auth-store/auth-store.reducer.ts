import { Action, createFeature, createReducer, on } from '@ngrx/store';
import { signInUser, signOutUser } from './auth-store.actions';
import { UserStoreState, initialState } from './state';
import { AUTH_STATE_NAME } from './auth-store.selectors';

const _reducer = createReducer(
  initialState,
  on(signInUser, (state, { user }): UserStoreState => {
    console.log('::: User signed in', user);
    return {
      ...state,
      userId: user?.userId,
      username: user?.username,
      loggedIn: true,
    };
  }),
  on(signOutUser, (state): UserStoreState => {
    console.log('::: User signed out');
    return {
      ...state,
      userId: undefined,
      username: undefined,
      loggedIn: false,
    };
  })
);

export function authReducer(state: UserStoreState, action: Action) {
  return _reducer(state, action);
}

export const authFeature = createFeature({
  name: AUTH_STATE_NAME,
  reducer: _reducer,
});
