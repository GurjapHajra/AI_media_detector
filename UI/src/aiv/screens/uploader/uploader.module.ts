import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploaderRoutingModule } from './uploader-routing.module';
import { UploaderComponent } from './uploader.component';
import { AssetUploaderDirective } from '@aiv/directives/image_uploader/asset-uploader.directive';
import { MediaUploaderComponent } from '@aiv/components/media-uploader/media-uploader.component';
import { StoreModule } from '@ngrx/store';
import { assetFeature } from '@aiv/store/assets-store/asset-store.reducer';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AssetUploaderDirective,
    UploaderComponent,
    MediaUploaderComponent,
  ],
  imports: [
    CommonModule,
    UploaderRoutingModule,
    MatButtonModule,
    StoreModule.forFeature(assetFeature.name, assetFeature.reducer),
  ],
  providers: [MediaManagementService],
})
export class UploaderModule {}
