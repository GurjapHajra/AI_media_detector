import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicSearchRoutingModule } from './public-search-routing.module';
import { PublicSearchComponent } from './public-search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { FormsModule } from '@angular/forms';
import { remoteAssetStoreModule } from '@aiv/store/remote-assets-store/auth-store.module';

@NgModule({
  declarations: [PublicSearchComponent],
  imports: [
    CommonModule,
    PublicSearchRoutingModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    remoteAssetStoreModule,
  ],
  providers: [MediaManagementService],
})
export class PublicSearchModule {}
