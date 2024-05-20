import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects'; // Import the createEffect function
import {
  Observable,
  catchError,
  exhaustMap,
  filter,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import * as AssetStoreActions from '../../store/assets-store/asset-store.actions';
import { Store } from '@ngrx/store';
import { assetFeature } from '@aiv/store/assets-store/asset-store.reducer';
import { AssetFile } from '@aiv/models/asset-file';
import { HttpClient } from '@angular/common/http';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { environment } from '@aiv/environment/environment';
import { getUser } from '@aiv/store/auth-store/auth-store.selectors';
import { TypedAction } from '@ngrx/store/src/models';
import {
  FlattenToPostUnsignUrlResponse,
  PostUnsignUrlResponse,
} from '@aiv/models/api-reponse-types';
import { SwalAlertService } from '@aiv/services/alert/swal-alert.service';

@Injectable()
export class AssetStoreEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private http: HttpClient,
    private mediaManagementService: MediaManagementService,
    private swalAlertService: SwalAlertService
  ) {}

  uploadAssets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssetStoreActions.uploadAsset),
      switchMap(() =>
        this.store.select(assetFeature.selectFiles).pipe(take(1))
      ),
      filter((assets) => {
        if (assets.length === 0) {
          this.store.dispatch(AssetStoreActions.uploadAssetFailure());
        }
        return assets.length > 0;
      }),
      switchMap((assets) => of(...assets)),
      concatLatestFrom(() =>
        this.store.select(getUser).pipe(map((user) => user))
      ),
      switchMap(([asset, user]) =>
        this.uploadAsset(asset, user.username ?? '').pipe(
          map(() => AssetStoreActions.reset()),
          catchError((err) => {
            console.error('Error uploading assets', err);
            return of(AssetStoreActions.uploadAssetFailure());
          })
        )
      )
    )
  );

  generateHashAndUpdateDB$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssetStoreActions.generateHashAndUpdateDB),
      concatLatestFrom(() =>
        this.store.select(getUser).pipe(map((user) => user))
      ),
      switchMap(([props, user]) =>
        this.http
          .get(
            `${environment.url}get_asset_url?asset_name=${props.name}&username=${user.username}`
          )
          .pipe(map((res: any) => ({ url: res['url'], name: props.name })))
      ),
      exhaustMap((url) =>
        this.http
          .get(url.url, { responseType: 'blob' })
          .pipe(map((blob) => ({ blob: blob, name: url.name })))
      ),
      switchMap((blob) => {
        return new Promise<{ res: string; name: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve({ res: reader.result as string, name: blob.name });
          reader.onerror = reject;
          reader.readAsDataURL(blob.blob);
        });
      }),
      map((res) =>
        AssetStoreActions.updateDBWithName({
          name: res.name,
          id: this.mediaManagementService.generateHash(res.res),
        })
      ),
      catchError((err) => {
        return of(AssetStoreActions.uploadAssetFailure());
      })
    )
  );

  updateDBWithName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssetStoreActions.updateDBWithName),
      tap(({ name, id }) => console.log(':::updateing db', name, id)),
      concatLatestFrom(() =>
        this.store.select(getUser).pipe(map((user) => user))
      ),
      switchMap(([{ id, name }, user]) =>
        this.http.post(
          `${environment.url}db?asset_id=${id}&asset_name=${name}&username=${user.username}`,
          null
        )
      ),
      map(() => AssetStoreActions.uploadAssetSuccess()),
      catchError((err) => {
        return of(AssetStoreActions.uploadAssetFailure());
      })
    )
  );

  uploadAssetFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AssetStoreActions.uploadAssetFailure),
        map(() =>
          this.swalAlertService.showIconAlert(
            'Error',
            'Error uploading asset',
            '',
            'error'
          )
        )
      ),
    { dispatch: false }
  );

  // result: upload a media file
  // intput: requires a AssetFile
  // output: god knows
  uploadAsset(
    media: AssetFile,
    username: string
  ): Observable<void | TypedAction<string>> {
    const formData = new FormData();

    return this.getPostUnsignUrl(
      media.file.name,
      media.file.type,
      username
    ).pipe(
      map((res) => {
        formData.append('key', res.fields.key);
        formData.append('AWSAccessKeyId', res.fields.AWSAccessKeyId);
        formData.append(
          'x-amz-security-token',
          res.fields['x-amz-security-token']
        );
        formData.append('policy', res.fields.policy);
        formData.append('signature', res.fields.signature);
        formData.append('file', media.file);
        return res;
      }),
      switchMap((res) => this.http.post(res.url, formData)),
      map(() =>
        this.store.dispatch(
          AssetStoreActions.generateHashAndUpdateDB({ name: media.file.name })
        )
      ),
      catchError((err) => of(AssetStoreActions.uploadAssetFailure()))
    );
  }

  // result: gets the prsigned url to post assets too
  // intput: requires the asset name and asset type
  // output: presigned url, with the fields required to post the asset
  getPostUnsignUrl(
    asset_name: string,
    asset_type: string,
    username: string
  ): Observable<PostUnsignUrlResponse> {
    return this.http
      .get(
        `${environment.url}get_upload_url?asset_name=${
          `${username}/` + asset_name
        }&asset_type=${asset_type}&username=${username}`
      )
      .pipe(
        map((res) => FlattenToPostUnsignUrlResponse(res)),
        catchError((err) => {
          this.store.dispatch(AssetStoreActions.uploadAssetFailure());
          return of(err);
        })
      );
  }
}
