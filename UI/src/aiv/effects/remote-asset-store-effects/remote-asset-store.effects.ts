import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects'; // Import the createEffect function
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import * as fromRemoteAssetStore from '@aiv/store/remote-assets-store/remote-asset-store.actions'; // Import the remote-asset-store actions
import { getListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.selectors';
import { catchError, map, of, switchMap, take, tap } from 'rxjs';
import { environment } from '@aiv/environment/environment';

@Injectable()
export class RemoteAssetStoreEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private http: HttpClient
  ) {}

  deleteAsset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRemoteAssetStore.deleteAsset),
      switchMap((props) =>
        this.store.select(getListAssets).pipe(
          take(1),
          map(
            (res) =>
              res.find((item) => item.asset_name === props.assetName)
                ?.asset_id ?? ''
          )
        )
      ),
      switchMap((id) =>
        this.http.post(`${environment.url}delete?asset_id=${id}`, null)
      ),
      map(() => fromRemoteAssetStore.deleteAssetSuccess()),
      catchError((err) => {
        alert('Error: ' + err.error.message);
        return of(err);
      })
    )
  );

  deleteAssetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromRemoteAssetStore.deleteAssetSuccess),
        map(() => {
          alert('Successfully deleted!');
        })
      ),
    { dispatch: false }
  );
}

/*this.store
      .select(getListAssets)
      .pipe(
        take(1),
        map((res) => {
          return res.find((item) => item.asset_name === name)?.asset_id ?? '';
        }),
        switchMap((asset_id) => {
          return this.MediaManagementService.deleteMedia(asset_id);
        }),
        map(() => {
          this.searched();
          alert('Successfully deleted!');
        }),
        catchError((err) => {
          alert('Error: ' + err.error.message);
          return err;
        })
      )
      .subscribe();
*/
