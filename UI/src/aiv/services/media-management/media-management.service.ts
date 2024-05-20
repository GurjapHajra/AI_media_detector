import { AssetFile } from '@aiv/models/asset-file';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@aiv/environment/environment';
import {
  Observable,
  catchError,
  exhaustMap,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import {
  FlattenToGetMediaListResponse,
  GetMediaListResponse,
  PostUnsignUrlResponse,
} from '@aiv/models/api-reponse-types';
import { FlattenToPostUnsignUrlResponse } from '@aiv/models/api-reponse-types';
import { Store } from '@ngrx/store';
import { getUser } from '@aiv/store/auth-store/auth-store.selectors';
@Injectable({
  providedIn: 'root',
})
export class MediaManagementService {
  constructor(
    private http: HttpClient,
    private store: Store,
    private swalAlertService: SwalAlertService
  ) {}

  // result: updates the database with the file name and file id using it's S3 info
  // intput: requires a file name and file id
  // output: god knows
  updateDB(file_name: string, file_id: string) {
    return this.http.post(
      `${environment.url}db?asset_id=${file_id}&asset_name=${file_name}`,
      null
    );
  }

  // result: gets the list of media files from the database (20 per page)
  // intput: requires a filter string and page number
  // output: list of media files
  getAssetListFromDb(
    filter?: string,
    page?: number
  ): Observable<GetMediaListResponse[]> {
    return this.store.select(getUser).pipe(
      switchMap((user) =>
        this.http
          .get(
            `${environment.url}/db?page=${page ?? 0}&filter=${
              filter ?? ''
            }&username=${user.username}`
          )
          .pipe(
            map((res: any) => {
              res = JSON.parse(res['assets']);
              res = res.reduce((acc: any, ele: any) => {
                acc.push(FlattenToGetMediaListResponse(ele));
                return acc;
              }, []);
              return res;
            }),
            catchError((err) => {
              return of(err);
            })
          )
      )
    );
  }

  getAssetById(id: string): Observable<GetMediaListResponse> {
    return this.http.get(`${environment.url}db_item_by_id?asset_id=${id}`).pipe(
      map((res: any) => {
        return FlattenToGetMediaListResponse(res['res']);
      })
    );
  }

  // result: deletes the asset from the database and S3 bucket
  // intput: requires a file id
  // output: god knows
  deleteMedia(id: string) {
    return this.http.post(`${environment.url}delete?asset_id=${id}`, null).pipe(
      map((res) => {
        return res;
      })
    );
  }

  // result: gets the presigned url to get the asset
  // intput: requires the asset name
  // output: presigned url
  getAssetPreSignUrl(name: string): Observable<{ url: string }> {
    return this.store.select(getUser).pipe(
      exhaustMap((user) =>
        this.http.get(
          `${environment.url}get_asset_url?asset_name=${name}&username=${user.username}`
        )
      ),
      map((res: any) => ({ url: res['url'] })),
      catchError((err) => {
        this.swalAlertService.showIconAlert(
          'Error getting asset url',
          'Try Again',
          '',
          'error'
        );
        return of({ url: '' });
      })
    );
  }

  // result: gets the asset in base64 from the presigned url
  // intput: requires the asset name
  // output: base64 string of the asset
  // Observable does resolve
  getBase64FromAssetName(name: string): Observable<string> {
    return this.getAssetPreSignUrl(name).pipe(
      switchMap((res: any) => this.fetchImageAsBase64(res.url))
    );
  }

  // result: gets the asset in base64 from the presigned url
  // intput: requires the asset url
  // output: base64 string of the asset
  fetchImageAsBase64(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      switchMap((blob) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      })
    );
  }

  // result: merges two images together image1 and image2 are urls presigned/urls/base64
  // intput: requires two images
  // output: base64 string of the merged image
  // the Observable does complete
  mergeImages(image1: string, image2: string): Observable<string> {
    let scale = 1;

    const canvas = document.createElement('canvas');
    return new Observable<string>((observer) => {
      if (canvas !== undefined) {
        const ctx = canvas.getContext('2d');
        const img1 = new Image();
        const img2 = new Image();

        img1.onload = () => {
          canvas.width = img1.width;
          canvas.height = img1.height;
          img2.setAttribute('crossorigin', 'anonymous');
          if (img1.width > 3000) {
            scale = 1;
          } else if (img1.width > 799) {
            scale = 2;
          } else {
            scale = 4;
          }
          img2.src = image2;
        };
        img2.onload = () => {
          ctx?.drawImage(img1, 0, 0);
          ctx?.drawImage(
            img2,
            img1.width - img2.width / scale - 10,
            10,
            img2.width / scale,
            img2.height / scale
          );
          observer.next(canvas.toDataURL());
          observer.complete();
        };
        img1.setAttribute('crossorigin', 'anonymous');
        img1.src = image1;
      } else {
        return observer.next('unable to load');
      }
    });
  }

  // result: gets the hash of the file
  // intput: requires the asset url
  // output: hash of the asset
  generateHash(res: string): string {
    return this.simpleHash(res);
  }

  // code from https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
  // result: generates a hash from a string 32bit 7 characters long
  // intput: requires a string, in our case base64 string
  simpleHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    // Convert to 32bit unsigned integer in base 36 and pad with "0" to ensure length is 7.
    return (hash >>> 0).toString(36).padStart(7, '0');
  }

  // result: helper function for cyrb64hash
  cyrb64(str: string, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    // For a single 53-bit numeric return value we could return
    // 4294967296 * (2097151 & h2) + (h1 >>> 0);
    // but we instead return the full 64-bit value:
    return [h2 >>> 0, h1 >>> 0];
  }

  // An improved, *insecure* 64-bit hash that's short, fast, and has no dependencies.
  // Output is always 14 characters.
  // result: generates a hash from a string 64bit 14 characters long
  cyrb64Hash(str: string, seed = 0) {
    const [h2, h1] = this.cyrb64(str, seed);
    return h2.toString(36).padStart(7, '0') + h1.toString(36).padStart(7, '0');
  }
}
