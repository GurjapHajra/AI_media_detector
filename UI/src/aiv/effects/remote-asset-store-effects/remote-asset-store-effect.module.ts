import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects'; // Import the createEffect function
import * as AssetStoreActions from '../../store/assets-store/asset-store.actions';
import { Store } from '@ngrx/store';
import { assetFeature } from '@aiv/store/assets-store/asset-store.reducer';
import { AssetFile } from '@aiv/models/asset-file';
import { HttpClient } from '@angular/common/http';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { environment } from '@aiv/environment/environment';

@Injectable()
export class RemoteAssetStoreEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private http: HttpClient,
    private mediaManagementService: MediaManagementService
  ) {}



}
