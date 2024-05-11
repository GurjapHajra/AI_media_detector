import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects'; // Import the createEffect function
import { map, mergeMap } from 'rxjs';
import * as AssetStoreActions from '../../store/assets-store/asset-store.actions';

@Injectable()
export class AssetStoreEffects {
  constructor(private actions$: Actions) {}

  loadAssets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssetStoreActions.addAsset),
      map(() => {
        console.log('::: wowowowowow');
        return AssetStoreActions.reset();
      })
    )
  );
}
