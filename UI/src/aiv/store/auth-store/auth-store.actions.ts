import { createAction, props } from '@ngrx/store';
import { UserStoreState } from './state';

export const signInUser = createAction(
  '[Remote Asset Store] addListAssets',
  props<{ user: UserStoreState }>()
);

export const signOutUser = createAction('[Remote Asset Store] Remove Asset');
