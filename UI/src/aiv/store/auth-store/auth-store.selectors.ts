import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserStoreState } from './state';

export const AUTH_STATE_NAME = 'AuthStoreState';

const getAuthState = createFeatureSelector<UserStoreState>(AUTH_STATE_NAME);

export const getUser = createSelector(getAuthState, (state) => {
  return state;
});

export const isLoggedIn = createSelector(getAuthState, (state) => {
  return state.loggedIn;
});
