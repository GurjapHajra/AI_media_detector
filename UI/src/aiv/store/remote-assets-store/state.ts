import { GetMediaListResponse } from '@aiv/models/api-reponse-types';

export interface remoteAssetStoreState {
  Listfiles: GetMediaListResponse[];
  length: number;
  deletingAsset: string | undefined;
}

export const initialState: remoteAssetStoreState = {
  Listfiles: [],
  length: 0,
  deletingAsset: undefined,
};
