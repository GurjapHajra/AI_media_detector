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

export const reset = createAction('[Asset Store] Reset');
