import { AssetFile } from 'src/aiv/models/asset-file';

export interface assetStoreState {
  files: AssetFile[];
  length: number;
}

export const initialState: assetStoreState = {
  files: [],
  length: 0,
};
