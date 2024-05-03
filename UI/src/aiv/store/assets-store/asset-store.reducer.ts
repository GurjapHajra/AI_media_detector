import { Action, createFeature, createReducer, on } from '@ngrx/store';
import { addAsset, removeAsset, reset, updateUser } from './asset-store.actions';
import * as UserActions from './asset-store.actions';
import { assetStoreState, initialState } from './state';
import { ASSET_STATE_NAME } from './asset-store.selectors';

export interface UserState {
  name: string;
  email: string;
}

const _reducer = createReducer(
  initialState,
  on(addAsset, (state, { assets }): assetStoreState => {
    return { ...state, files: [...state.files, ...assets] };
  }),

  on(reset, (state): assetStoreState => {
    return { ...state, files: [] };
  })
);

export function assetReducer(state: assetStoreState, action: Action) {
  return _reducer(state, action);
}

export const assetFeature = createFeature({
  name: ASSET_STATE_NAME,
  reducer: _reducer,
});

export const userReducer = createReducer(
  initialState,
  on(UserActions.updateUser, (state, { name, email }) => ({
    ...state,
    name,
    email
  }))
);  