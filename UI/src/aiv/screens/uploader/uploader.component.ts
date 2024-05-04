import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssetFile } from 'src/aiv/models/asset-file';
import * as fromAssetStore from '@aiv/store/assets-store/asset-store.actions';
import { assetFeature } from '@aiv/store/assets-store/asset-store.reducer';
import { Observable, map, switchMap, take, tap } from 'rxjs';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';

@Component({
  selector: 'aiv-uploader',
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss',
})
export class UploaderComponent {
  constructor(
    private store: Store,
    private MediaManagementService: MediaManagementService
  ) {}

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
    this.getlocalAsset()
      .pipe(
        switchMap((assets) =>
          this.MediaManagementService.uploadMultipleAssets(assets)
        ),
        tap(() => this.store.dispatch(fromAssetStore.reset()))
      )
      .subscribe();
  }
}
