import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaFinderRoutingModule } from './media-finder-routing.module';
import { MediaFinderComponent } from './media-finder.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { FormsModule } from '@angular/forms';
import { remoteAssetStoreModule } from '@aiv/store/remote-assets-store/auth-store.module';

@NgModule({
  declarations: [MediaFinderComponent],
  imports: [
    CommonModule,
    MediaFinderRoutingModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    remoteAssetStoreModule,
  ],
  providers: [MediaManagementService],
})
export class MediaFinderModule {}
