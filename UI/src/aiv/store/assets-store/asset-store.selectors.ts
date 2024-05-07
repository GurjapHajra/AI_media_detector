
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { assetStoreState } from './state';

export const ASSET_STATE_NAME = 'AssetStoreState';

const getAssetState = createFeatureSelector<assetStoreState>(ASSET_STATE_NAME);

export const getAllAssets = createSelector(getAssetState, (state) => {
  return state.files;
});
