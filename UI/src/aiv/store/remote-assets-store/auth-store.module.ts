import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { remoteAssetFeature } from './remote-asset-store.reducer';

@NgModule({
  imports: [StoreModule.forFeature(remoteAssetFeature.name, remoteAssetFeature.reducer)],
})
export class remoteAssetStoreModule {}
