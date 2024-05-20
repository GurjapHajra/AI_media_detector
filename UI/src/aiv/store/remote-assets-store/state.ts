import { GetMediaListResponse } from '@aiv/models/api-reponse-types';

export interface remoteAssetStoreState {
  Listfiles: GetMediaListResponse[];
  length: number;
  is_deleting: {
    name: string;
    status: boolean;
  };
}

export const initialState: remoteAssetStoreState = {
  Listfiles: [],
  length: 0,
  is_deleting: {
    name: '',
    status: false,
  },
};
