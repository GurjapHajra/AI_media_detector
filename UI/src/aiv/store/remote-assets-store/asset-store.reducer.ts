import { Action, createFeature, createReducer, on } from '@ngrx/store';
import { addListAssets, removeAsset, reset } from './asset-store.actions';
import { remoteAssetStoreState, initialState } from './state';

const _reducer = createReducer(
  initialState,
  on(addListAssets, (state, { ListAssets }): remoteAssetStoreState => {
    return { ...state, Listfiles: ListAssets };
  }),
  on(reset, (state): remoteAssetStoreState => {
    return { ...state, Listfiles: [] };
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
