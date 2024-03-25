import { createFeatureSelector, createSelector } from '@ngrx/store';
import { remoteAssetStoreState } from './state';

export const ASSET_STATE_NAME = 'asset-store';

const getAssetState =
  createFeatureSelector<remoteAssetStoreState>(ASSET_STATE_NAME);

export const getAllAssets = createSelector(getAssetState, (state) => {
  return state.files;
});
