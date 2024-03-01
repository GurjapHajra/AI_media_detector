import { Action, createFeature, createReducer, on } from '@ngrx/store';
import { addAsset, removeAsset, reset } from './asset-store.actions';
import { assetStoreState, initialState } from './state';

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
  name: 'assetFeatureKey',
  reducer: _reducer,
});
