import { AssetFile } from 'src/aiv/models/asset-file';

export interface remoteAssetStoreState {
  files: AssetFile[];
  length: number;
}

export const initialState: remoteAssetStoreState = {
  files: [],
  length: 0,
};
