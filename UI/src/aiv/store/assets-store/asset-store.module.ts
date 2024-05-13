import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { assetFeature } from './asset-store.reducer';

@NgModule({
  imports: [StoreModule.forFeature(assetFeature.name, assetFeature.reducer)],
})
export class AssetStoreModule {}
