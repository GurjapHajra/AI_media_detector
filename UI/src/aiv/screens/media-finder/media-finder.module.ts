import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaFinderRoutingModule } from './media-finder-routing.module';
import { MediaFinderComponent } from './media-finder.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StoreModule } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { remoteAssetFeature } from '@aiv/store/remote-assets-store/asset-store.reducer';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [MediaFinderComponent],
  imports: [
    CommonModule,
    MediaFinderRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    StoreModule.forFeature(remoteAssetFeature.name, remoteAssetFeature.reducer),
  ],
})
export class MediaFinderModule {}
