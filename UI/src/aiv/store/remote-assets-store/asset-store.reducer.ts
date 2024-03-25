import { Action, createFeature, createReducer, on } from '@ngrx/store';
import { addAsset, removeAsset, reset } from './asset-store.actions';
import { remoteAssetStoreState, initialState } from './state';

const _reducer = createReducer(
  initialState,
  on(addAsset, (state, { assets }): remoteAssetStoreState => {
    return { ...state, files: [...state.files, ...assets] };
  }),

  on(reset, (state): remoteAssetStoreState => {
    return { ...state, files: [] };
  })
);

export function remoteAssetReducer(
  state: remoteAssetStoreState,
  action: Action
) {
  return _reducer(state, action);
}

export const remoteAssetFeature = createFeature({
  name: 'remoteAssetStoreState',
  reducer: _reducer,
});
