import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssetFile } from 'src/aiv/models/asset-file';
import * as fromAssetStore from '@aiv/store/assets-store/asset-store.actions';
import {
  getAllAssets,
  getUploadStatus,
} from '@aiv/store/assets-store/asset-store.selectors';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'aiv-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  protected isUploading: Observable<boolean> = this.store
    .select(getUploadStatus)
    .pipe(map((status) => (status === 'uploading' ? true : false)));

  constructor(private store: Store) {}

  assetDropped(assets: AssetFile[]) {
    this.store.dispatch(fromAssetStore.addAsset({ assets }));
  }

  getlocalAsset(): Observable<AssetFile[]> {
    return this.store.select(getAllAssets);
  }

  upload() {
    this.store.dispatch(fromAssetStore.uploadAsset());
  }
}
