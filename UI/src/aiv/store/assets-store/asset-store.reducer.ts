// asset-store.reducer.ts
import { Action, createFeature, createReducer, on } from '@ngrx/store';
import {
  addAsset,
  reset,
  uploadAsset,
  uploadAssetSuccess,
  uploadAssetFailure,
} from './asset-store.actions';
import { assetStoreState, initialState } from './state';
import { ASSET_STATE_NAME } from './asset-store.selectors';

const _reducer = createReducer(
  initialState,
  on(addAsset, (state, { assets }): assetStoreState => {
    return { ...state, files: [...state.files, ...assets] };
  }),
  on(uploadAsset, (state): assetStoreState => {
    return { ...state, uploadStatus: 'uploading' };
  }),
  on(uploadAssetSuccess, (state): assetStoreState => {
    return { ...state, uploadStatus: 'completed' };
  }),
  on(uploadAssetFailure, (state): assetStoreState => {
    return { ...state, uploadStatus: 'failed' };
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