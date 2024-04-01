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
