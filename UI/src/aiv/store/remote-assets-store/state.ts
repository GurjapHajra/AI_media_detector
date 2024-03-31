import { GetMediaListResponse } from '@aiv/models/api-reponse-types';

export interface remoteAssetStoreState {
  Listfiles: GetMediaListResponse[];
  length: number;
}

export const initialState: remoteAssetStoreState = {
  Listfiles: [],
  length: 0,
};
