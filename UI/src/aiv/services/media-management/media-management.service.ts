import { AssetFile } from '@aiv/models/asset-file';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@aiv/environment/environment';
import { Observable, map, take } from 'rxjs';
import { PostUnsignUrlResponse } from '@aiv/models/api-reponse-types';
import { FlattenToPostUnsignUrlResponse } from '@aiv/models/api-reponse-types';

@Injectable({
  providedIn: 'root',
})
export class MediaManagementService {
  constructor(private http: HttpClient) {}

  uploadMediaFiles(assets: AssetFile[]) {
    assets.forEach((asset) => {
      this.uploadMedia(asset);
    });
  }

  uploadMedia(media: AssetFile) {
    const formData = new FormData();

    return this.getPostUnsignUrl(media.file.name)
      .pipe(take(1))
      .subscribe((res: PostUnsignUrlResponse) => {
        formData.append('file', media.file);
        return this.http.post(res.url, formData).subscribe((val) => {
          console.log(val);
        });
      });
  }

  getMedia() {
    return this.http.get('/api/media');
  }
  deleteMedia(id: string) {
    return this.http.delete(`/api/media/${id}`);
  }
  getPostUnsignUrl(file_name: string): Observable<PostUnsignUrlResponse> {
    return this.http
      .post(`${environment.url}?file_name=${file_name}`, null)
      .pipe(map((res) => FlattenToPostUnsignUrlResponse(res)));
  }
}
