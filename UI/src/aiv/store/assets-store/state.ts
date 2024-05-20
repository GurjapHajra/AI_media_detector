import { AssetFile } from 'src/aiv/models/asset-file';

export interface assetStoreState {
  files: AssetFile[];
  length: number;
  uploadStatus: 'idle' | 'uploading' | 'completed' | 'failed';
}

export const initialState: assetStoreState = {
  files: [],
  length: 0,
  uploadStatus: 'idle',
};