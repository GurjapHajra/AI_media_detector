import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect, concatLatestFrom } from '@ngrx/effects';
import { Store, props } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import * as fromRemoteAssetStore from '@aiv/store/remote-assets-store/remote-asset-store.actions'; // Import the remote-asset-store actions
import { getListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.selectors';
import { catchError, exhaustMap, map, of, switchMap, take } from 'rxjs';
import { environment } from '@aiv/environment/environment';
import { getUser } from '@aiv/store/auth-store/auth-store.selectors';
import { SwalAlertService } from '../../services/alert/swal-alert.service';

@Injectable()
export class RemoteAssetStoreEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private http: HttpClient,
    private swalAlertService: SwalAlertService
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
      concatLatestFrom(() =>
        this.store.select(getUser).pipe(map((user) => user))
      ),
      switchMap(([id, user]) =>
        this.http
          .post(
            `${environment.url}delete?asset_id=${id}&username=${user.username}`,
            null
          )
          .pipe(
            map(() => fromRemoteAssetStore.deleteAssetSuccess({ assetId: id })),
            catchError((err) => {
              return of(fromRemoteAssetStore.deleteAssetFailure());
            })
          )
      ),
      catchError((err) => {
        return of(fromRemoteAssetStore.deleteAssetFailure());
      })
    )
  );

  deleteAssetSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRemoteAssetStore.deleteAssetSuccess),
      map((props) => {
        this.swalAlertService.showIconAlert(
          'Success',
          'Asset deleted successfully',
          '',
          'success'
        );
        return fromRemoteAssetStore.removeAssetFromList({
          assetId: props.assetId,
        });
      })
    )
  );

  deleteAssetFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromRemoteAssetStore.deleteAssetFailure),
        map(() => {
          this.swalAlertService.showIconAlert(
            'Error',
            'Failed to delete asset',
            '',
            'error'
          );
        })
      ),
    { dispatch: false }
  );

  verifyAsset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRemoteAssetStore.verifyAsset),
      exhaustMap((props) =>
        this.http.post(
          `${environment.url}verify?asset_id=${props.assetId}`,
          null
        )
      ),
      map(() => fromRemoteAssetStore.verifyAssetSuccess()),
      catchError((err) => {
        alert('Error: ' + err.error.message);
        return of(err);
      })
    )
  );

  verifyAssetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromRemoteAssetStore.verifyAssetSuccess),
        map(() => {
          this.swalAlertService.showAlertSimple('verified');
        })
      ),
    { dispatch: false }
  );
}
