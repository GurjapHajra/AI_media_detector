import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssetFile } from 'src/aiv/models/asset-file';
import * as fromAssetStore from '@aiv/store/assets-store/asset-store.actions';
import { assetFeature } from '@aiv/store/assets-store/asset-store.reducer';
import { Observable, take } from 'rxjs';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';

@Component({
  selector: 'aiv-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  constructor(
    private store: Store,
    private MediaManagementService: MediaManagementService
  ) {}

  assetDropped(assets: AssetFile[]) {
    this.store.dispatch(fromAssetStore.addAsset({ assets }));
  }

  getlocalAsset(): Observable<AssetFile[]> {
    return this.store.select(assetFeature.selectFiles);
  }

  upload() {
    this.getlocalAsset()
      .pipe(take(1))
      .subscribe((assets) => {
        this.MediaManagementService.uploadMediaFiles(assets);
        this.store.dispatch(fromAssetStore.reset());
      });
  }
}
