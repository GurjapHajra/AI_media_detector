import { createFeatureSelector, createSelector } from '@ngrx/store';
import { assetStoreState } from './state';

import { HomePageComponent } from '@aiv/screens/home-page/home-page.component';

export const ASSET_STATE_NAME = 'asset-store';

const getAssetState = createFeatureSelector<assetStoreState>(ASSET_STATE_NAME);

export const getAllAssets = createSelector(getAssetState, (state) => {
  return state.files;
});
