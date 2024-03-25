import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaFinderRoutingModule } from './media-finder-routing.module';
import { StoreModule } from '@ngrx/store';
import { remoteAssetFeature } from '@aiv/store/remote-assets-store/asset-store.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MediaFinderRoutingModule,
    StoreModule.forFeature(remoteAssetFeature.name, remoteAssetFeature.reducer),
  ],
})
export class MediaFinderModule {}
