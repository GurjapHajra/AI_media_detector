import { createAction, props } from '@ngrx/store';
import { UserStoreState } from './state';

export const signInUser = createAction(
  '[Auth Store] signInUser',
  props<{ user: UserStoreState }>()
);

export const signOutUser = createAction('[Auth Store] signOutUser');
