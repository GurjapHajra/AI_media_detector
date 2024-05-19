import { GetMediaListResponse } from '@aiv/models/api-reponse-types';
import { createAction, props } from '@ngrx/store';

export const addListAssets = createAction(
  '[Remote Asset Store] addListAssets',
  props<{ ListAssets: GetMediaListResponse[] }>()
);

export const removeAsset = createAction(
  '[Remote Asset Store] Remove Asset',
  props<{ assetName: string }>()
);

export const reset = createAction('[Remote Asset Store] Reset');

export const deleteAsset = createAction(
  '[Remote Asset Store] Delete Asset',
  props<{ assetName: string }>()
);

export const deleteAssetSuccess = createAction(
  '[Remote Asset Store] Delete Asset Success'
);

export const verifyAsset = createAction(
  '[Remote Asset Store] Verify Asset',
  props<{ assetId: string }>()
);

export const verifyAssetSuccess = createAction(
  '[Remote Asset Store] Verify Asset Success'
);
