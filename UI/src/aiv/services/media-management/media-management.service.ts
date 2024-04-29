import { AssetFile } from '@aiv/models/asset-file';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@aiv/environment/environment';
import { Observable, map, take } from 'rxjs';
import {
  FlattenToGetMediaListResponse,
  GetMediaListResponse,
  PostUnsignUrlResponse,
} from '@aiv/models/api-reponse-types';
import { FlattenToPostUnsignUrlResponse } from '@aiv/models/api-reponse-types';

@Injectable({
  providedIn: 'root',
})
export class MediaManagementService {

  constructor(private http: HttpClient) { }

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

}
