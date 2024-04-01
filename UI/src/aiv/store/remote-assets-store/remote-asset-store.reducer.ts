import { Action, createFeature, createReducer, on } from '@ngrx/store';
import { addListAssets, reset } from './remote-asset-store.actions';
import { remoteAssetStoreState, initialState } from './state';
import { ASSET_STATE_NAME } from './remote-asset-store.selectors';

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
  name: ASSET_STATE_NAME,
  reducer: _reducer,
});
