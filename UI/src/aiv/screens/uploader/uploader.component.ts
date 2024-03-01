import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AssetFile } from 'src/aiv/models/asset-file';
import * as fromAssetStore from '@aiv/store/assets-store/asset-store.actions';
import { assetFeature } from '@aiv/store/assets-store/asset-store.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  constructor(private store: Store) {}

  assetDropped(assets: AssetFile[]) {
    this.store.dispatch(fromAssetStore.addAsset({ assets }));
  }

  getAsset(): Observable<AssetFile[]> {
    return this.store.select(assetFeature.selectFiles);
  }
}
