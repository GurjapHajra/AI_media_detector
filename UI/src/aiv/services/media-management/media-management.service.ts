import { AssetFile } from '@aiv/models/asset-file';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@aiv/environment/environment';
import {
  Observable,
  catchError,
  from,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  FlattenToGetMediaListResponse,
  GetMediaListResponse,
  PostUnsignUrlResponse,
} from '@aiv/models/api-reponse-types';
import { FlattenToPostUnsignUrlResponse } from '@aiv/models/api-reponse-types';
import { DomSanitizer } from '@angular/platform-browser';

import { md5 } from 'js-md5';

@Injectable({
  providedIn: 'root',
})
export class MediaManagementService {
  constructor(private http: HttpClient) {}

  //upload multiple media files
  uploadMultipleAssets(assets: AssetFile[]): Observable<string> {
    console.log(':::Uploading all', assets);
    return from(assets).pipe(switchMap((asset) => this.uploalAsset(asset)));
  }

  uploalAsset(media: AssetFile): Observable<string> {
    console.log(':::Uploading', media);

    const formData = new FormData();

    return this.getPostUnsignUrl(media.file.name, media.file.type).pipe(
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
      switchMap(() => this.getAssetPreSignUrl(media.file.name)),
      switchMap((url) => this.generateHash(url.url)),
      switchMap((hash) => this.updateDB(media.file.name, hash)),
      map(() => of('success')),
      catchError((err) => {
        return of(err);
      })
    );

    // .subscribe((res: PostUnsignUrlResponse) => {
    //   formData.append('key', res.fields.key);
    //   formData.append('AWSAccessKeyId', res.fields.AWSAccessKeyId);
    //   formData.append(
    //     'x-amz-security-token',
    //     res.fields['x-amz-security-token']
    //   );
    //   formData.append('policy', res.fields.policy);
    //   formData.append('signature', res.fields.signature);
    //   formData.append('file', media.file);

    //   return this.http.post(res.url, formData).subscribe((val) => {
    //     this.getMediaUrl(res.fields.key).subscribe((url) => {
    //       this.generateHash(url.url).subscribe((hash) => {
    //         this.updateDB(media.file.name, hash).subscribe((val) =>
    //           console.log(':::DB Updated', val)
    //         );
    //       });
    //     });
    //   });
    // });
  }

  updateDB(file_name: string, file_id: string) {
    return this.http.post(
      `${environment.url}db?asset_id=${file_id}&asset_name=${file_name}`,
      null
    );
  }

  getAssetListFromDb(
    filter?: string,
    page?: number
  ): Observable<GetMediaListResponse[]> {
    return this.http
      .get(`${environment.url}/db?page=${page ?? 0}&filter=${filter ?? ''}`)
      .pipe(
        map((res: any) => {
          res = JSON.parse(res['assets']);
          res = res.reduce((acc: any, ele: any) => {
            acc.push(FlattenToGetMediaListResponse(ele));
            return acc;
          }, []);
          return res;
        })
      );
  }

  deleteMedia(id: string) {
    return this.http.post(`${environment.url}delete?asset_id=${id}`, null).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getPostUnsignUrl(
    asset_name: string,
    asset_type: string
  ): Observable<PostUnsignUrlResponse> {
    return this.http
      .get(
        `${environment.url}get_upload_url?asset_name=${asset_name}&asset_type=${asset_type}`
      )
      .pipe(map((res) => FlattenToPostUnsignUrlResponse(res)));
  }

  getAssetPreSignUrl(name: string): Observable<{ url: string }> {
    return this.http
      .get(`${environment.url}get_asset_url?asset_name=${name}`)
      .pipe(
        map((res: any) => {
          return { url: res['url'] };
        })
      );
  }

  getBase64FromAssetName(name: string): Observable<string> {
    return this.getAssetPreSignUrl(name).pipe(
      switchMap((res: any) => this.fetchImageAsBase64(res.url))
    );
  }

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
        };
        img1.setAttribute('crossorigin', 'anonymous');
        img1.src = image1;
      } else {
        return observer.next('unable to load');
      }
    });
  }

  generateHash(file: string): Observable<string> {
    return this.fetchImageAsBase64(file).pipe(
      map((res) => this.simpleHash(res))
    );
  }

  // code from https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
  simpleHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    // Convert to 32bit unsigned integer in base 36 and pad with "0" to ensure length is 7.
    return (hash >>> 0).toString(36).padStart(7, '0');
  }

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
  cyrb64Hash(str: string, seed = 0) {
    const [h2, h1] = this.cyrb64(str, seed);
    return h2.toString(36).padStart(7, '0') + h1.toString(36).padStart(7, '0');
  }
}
