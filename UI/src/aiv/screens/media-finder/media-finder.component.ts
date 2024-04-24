import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { addListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.actions';
import { getListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.selectors';
import { map, take } from 'rxjs';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-media-finder',
  templateUrl: './media-finder.component.html',
  styleUrl: './media-finder.component.scss',
})
export class MediaFinderComponent {
  protected picUrl: string = '';

  protected searchResult = this.store.select(getListAssets).pipe(
    map((assets) => {
      return assets.map((item) => {
        let date = new Date(item.LastModified).toLocaleDateString();

        return {
          name: item.key,
          size: Math.round(item.Size / 10) / 100,
          LastModified: date,
        };
      });
    })
  );

  displayedColumns: string[] = [
    'name',
    'size',
    'LastModified',
    'view',
    'verify',
  ];

  constructor(
    private store: Store,
    private MediaManagementService: MediaManagementService
  ) {}

  protected searched() {
    this.MediaManagementService.getMedia().subscribe((res) => {
      this.store.dispatch(addListAssets({ ListAssets: res }));
    });
  }

  protected openImage(key: string) {
    this.MediaManagementService.getMediaUrl(key).subscribe((res) => {
      take(1);
      this.picUrl = res.url;
    });
  }

  protected verify(name: any) {
    this.MediaManagementService.getAssetFile(name).subscribe((res) => {
      this.mergeImages(res);
    });
  }

  protected mergeImages(url: string) {
    QRCode.toDataURL('flaticon.com/123456789012=jlj;', {
      margin: 1,
      color: {
        dark: '#6A1B9A',
        light: '#69F0AE',
      },
    }).then((qrUrl) => {
      this.MediaManagementService.mergeImages(url, qrUrl).subscribe((res) => {
        this.picUrl = res;
      });
    });
  }
}
