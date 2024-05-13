import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploaderRoutingModule } from './uploader-routing.module';
import { UploaderComponent } from './uploader.component';
import { AssetUploaderDirective } from '@aiv/directives/image_uploader/asset-uploader.directive';
import { MediaUploaderComponent } from '@aiv/components/media-uploader/media-uploader.component';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { MatButtonModule } from '@angular/material/button';
import { AssetStoreEffectsModule } from '@aiv/effects/asset-store-effects/asset-store-effects.module';
import { AssetStoreModule } from '@aiv/store/assets-store/asset-store.module';

@NgModule({
  declarations: [
    AssetUploaderDirective,
    UploaderComponent,
    MediaUploaderComponent,
  ],
  imports: [
    AssetStoreEffectsModule,
    CommonModule,
    UploaderRoutingModule,
    MatButtonModule,
    AssetStoreModule,
  ],
  providers: [MediaManagementService],
})
export class UploaderModule {}
