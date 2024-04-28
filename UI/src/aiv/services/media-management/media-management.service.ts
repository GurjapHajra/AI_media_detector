import { AssetFile } from '@aiv/models/asset-file';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@aiv/environment/environment';
import { Observable, map, switchMap, take } from 'rxjs';
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
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  uploadMediaFiles(assets: AssetFile[]) {
    assets.forEach((asset) => {
      this.uploadMedia(asset);
    });
  }

  uploadMedia(media: AssetFile) {
    const formData = new FormData();

    return this.getPostUnsignUrl(media.file.name, media.file.type)
      .pipe(take(1))
      .subscribe((res: PostUnsignUrlResponse) => {
        formData.append('key', res.fields.key);
        formData.append('AWSAccessKeyId', res.fields.AWSAccessKeyId);
        formData.append(
          'x-amz-security-token',
          res.fields['x-amz-security-token']
        );
        formData.append('policy', res.fields.policy);
        formData.append('signature', res.fields.signature);
        formData.append('file', media.file);

        return this.http.post(res.url, formData).subscribe((val) => {
          console.log(val);
        });
      });
  }

  getMedia(): Observable<GetMediaListResponse[]> {
    return this.http.get(`${environment.url}`).pipe(
      map((res: any) => {
        res = JSON.parse(res['message']);
        res = res.reduce((acc: any, ele: any) => {
          acc.push(FlattenToGetMediaListResponse(ele));
          return acc;
        }, []);
        return res;
      })
    );
  }

  deleteMedia(id: string) {
    return this.http.delete(`/api/media/${id}`);
  }

  getPostUnsignUrl(
    file_name: string,
    file_type: string
  ): Observable<PostUnsignUrlResponse> {
    return this.http
      .post(
        `${environment.url}?file_name=${file_name}&file_type=${file_type}`,
        null
      )
      .pipe(map((res) => FlattenToPostUnsignUrlResponse(res)));
  }

  getMediaUrl(key: string): Observable<{ url: string }> {
    return this.http.get(`${environment.url}?file_name=${key}`).pipe(
      map((res: any) => {
        return { url: res['url'] };
      })
    );
  }

  getAssetFile(name: string): Observable<string> {
    return this.http
      .get(`${environment.url}?file_name=${name}`)
      .pipe(switchMap((res: any) => this.fetchImageAsBase64(res.url)));
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
          img2.src = image2;
        };
        img2.onload = () => {
          ctx?.drawImage(img1, 0, 0);
          ctx?.drawImage(
            img2,
            img1.width - img2.width - 10,
            10,
            img2.width,
            img2.height
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
    return this.fetchImageAsBase64(file).pipe(map((res) => md5.base64(res)));
  }
}
