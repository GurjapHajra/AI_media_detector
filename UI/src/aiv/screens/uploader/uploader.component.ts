import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssetFile } from 'src/aiv/models/asset-file';
import * as fromAssetStore from '@aiv/store/assets-store/asset-store.actions';
import { assetFeature } from '@aiv/store/assets-store/asset-store.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'aiv-uploader',
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss',
})
export class UploaderComponent {
  constructor(private store: Store) {}

  assetDropped(assets: AssetFile[]) {
    this.store.dispatch(fromAssetStore.addAsset({ assets }));
    // for testing purposes: get hash code when file dropped

    // this.MediaManagementService.fetchImageAsBase64(
    //   assets[0].url?.toString() ?? ''
    // );
  }

  getlocalAsset(): Observable<AssetFile[]> {
    return this.store.select(assetFeature.selectFiles);
  }

  upload() {
    this.store.dispatch(fromAssetStore.uploadAsset());
  }
}
