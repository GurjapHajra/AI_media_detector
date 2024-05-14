import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects'; // Import the createEffect function
import {
  Observable,
  catchError,
  exhaustMap,
  from,
  map,
  of,
  repeat,
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

@Injectable()
export class AssetStoreEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private http: HttpClient,
    private mediaManagementService: MediaManagementService
  ) {}

  uploadAssets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssetStoreActions.uploadAsset),
      tap(() => console.log(':::Uploading Assets')),
      switchMap(() =>
        this.store.select(assetFeature.selectFiles).pipe(take(1))
      ),
      switchMap((assets) => of(...assets)),
      concatLatestFrom(() =>
        this.store.select(getUser).pipe(map((user) => user))
      ),
      switchMap(([asset, user]) =>
        this.uploadAsset(asset, user.username ?? '').pipe(
          map(() => AssetStoreActions.reset()),
          catchError((err) => {
            console.log('Error uploading assets');
            return of(AssetStoreActions.reset());
          })
        )
      )
    )
  );

  generateHashAndUpdateDB$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssetStoreActions.generateHashAndUpdateDB),
      tap((name) => console.log(':::generating hash from name', name)),
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
        console.log('3. Error uploading asset', err);
        return of(err);
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
      map(() => AssetStoreActions.reset()),
      catchError((err) => {
        console.log('4. Error uploading asset', err);
        return of(err);
      })
    )
  );

  // result: upload a media file
  // intput: requires a AssetFile
  // output: god knows
  uploadAsset(media: AssetFile, username: string): Observable<string> {
    console.log(':::Uploading', media);

    const formData = new FormData();

    return this.mediaManagementService
      .getPostUnsignUrl(`${username}/` + media.file.name, media.file.type)
      .pipe(
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
        catchError((err) => {
          console.log('2. Error uploading asset', err);
          return of(err);
        })
      );
  }
}
