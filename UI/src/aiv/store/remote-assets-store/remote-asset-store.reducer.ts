import { Action, createFeature, createReducer, on } from '@ngrx/store';
import {
  addListAssets,
  deleteAsset,
  deleteAssetFailure,
  deleteAssetSuccess,
  removeAssetFromList,
  reset,
} from './remote-asset-store.actions';
import { remoteAssetStoreState, initialState } from './state';
import { ASSET_STATE_NAME } from './remote-asset-store.selectors';

const _reducer = createReducer(
  initialState,
  on(addListAssets, (state, { ListAssets }): remoteAssetStoreState => {
    return { ...state, Listfiles: ListAssets };
  }),

  on(reset, (state): remoteAssetStoreState => {
    return { ...state, Listfiles: [] };
  }),
  on(deleteAsset, (state, { assetName }): remoteAssetStoreState => {
    return { ...state, is_deleting: { name: assetName, status: true } };
  }),
  on(deleteAssetSuccess, (state): remoteAssetStoreState => {
    return { ...state, is_deleting: { name: '', status: false } };
  }),
  on(deleteAssetFailure, (state): remoteAssetStoreState => {
    return { ...state, is_deleting: { name: '', status: false } };
  }),
  on(removeAssetFromList, (state, { assetId }): remoteAssetStoreState => {
    return {
      ...state,
      Listfiles: state.Listfiles.filter((item) => item.asset_id !== assetId),
    };
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
