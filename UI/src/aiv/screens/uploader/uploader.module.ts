import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploaderRoutingModule } from './uploader-routing.module';
import { StoreModule } from '@ngrx/store';
import { assetFeature } from '@aiv/store/assets-store/asset-store.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UploaderRoutingModule,
    StoreModule.forFeature(assetFeature.name, assetFeature.reducer),
  ],
})
export class UploaderModule {}
