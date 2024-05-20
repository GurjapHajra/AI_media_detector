// asset-store.actions.ts
import { createAction, props } from '@ngrx/store';
import { AssetFile } from 'src/aiv/models/asset-file';

export const addAsset = createAction(
  '[Asset Store] Add Asset',
  props<{ assets: AssetFile[] }>()
);

export const removeAsset = createAction(
  '[Asset Store] Remove Asset',
  props<{ assetName: string }>()
);

export const uploadAsset = createAction('[Asset Store] Upload Asset');

export const uploadAssetSuccess = createAction(
  '[Asset Store] Upload Asset Success',
  props<{ name: string }>()
);

export const uploadAssetFailure = createAction(
  '[Asset Store] Upload Asset Failure'
);

export const generateHashAndUpdateDB = createAction(
  '[Asset Store] Generate Hash from name',
  props<{ name: string }>()
);

export const updateDBWithName = createAction(
  '[Asset Store] Update DB With Name',
  props<{ name: string; id: string }>()
);

export const reset = createAction('[Asset Store] Reset');
