import { createFeatureSelector, createSelector } from '@ngrx/store';
import { remoteAssetStoreState } from './state';

export const ASSET_STATE_NAME = 'remoteAssetStoreState';

const getRemoteAssetState =
  createFeatureSelector<remoteAssetStoreState>(ASSET_STATE_NAME);

export const getListAssets = createSelector(getRemoteAssetState, (state) => {
  return state.Listfiles;
});
