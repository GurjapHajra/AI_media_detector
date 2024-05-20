import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssetFile } from 'src/aiv/models/asset-file';
import * as fromAssetStore from '@aiv/store/assets-store/asset-store.actions';
import { getAllAssets, getUploadStatus } from '@aiv/store/assets-store/asset-store.selectors';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'aiv-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnDestroy {
  isUploading = false;
  private uploadSubscription: Subscription;

  constructor(private store: Store) {
    this.uploadSubscription = new Subscription();
  }

  assetDropped(assets: AssetFile[]) {
    this.store.dispatch(fromAssetStore.addAsset({ assets }));
  }

  getlocalAsset(): Observable<AssetFile[]> {
    return this.store.select(getAllAssets);
  }

  upload() {
    this.isUploading = true;
    this.store.dispatch(fromAssetStore.uploadAsset());
    this.uploadSubscription = this.store.select(getUploadStatus)
      .pipe(filter(status => status !== 'uploading'))
      .subscribe(status => {
        this.isUploading = false;
      });
  }

  ngOnDestroy() {
    this.uploadSubscription.unsubscribe();
  }
}