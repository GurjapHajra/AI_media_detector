import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicSearchRoutingModule } from './public-search-routing.module';
import { PublicSearchComponent } from './public-search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StoreModule } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { remoteAssetFeature } from '@aiv/store/remote-assets-store/remote-asset-store.reducer';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PublicSearchComponent
  ],
  imports: [
    CommonModule,
    PublicSearchRoutingModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    StoreModule.forFeature(remoteAssetFeature.name, remoteAssetFeature.reducer),
  ],
  providers: [MediaManagementService],
})
export class PublicSearchModule { }
