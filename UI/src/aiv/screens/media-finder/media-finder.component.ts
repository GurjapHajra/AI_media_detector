import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { addListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.actions';
import { getListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.selectors';
import { Observable, map, take } from 'rxjs';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-media-finder',
  templateUrl: './media-finder.component.html',
  styleUrl: './media-finder.component.scss',
})
export class MediaFinderComponent {
  protected picUrl: string = '';
  protected filter: string = '';

  protected searchResult = this.store.select(getListAssets).pipe(
    map((assets) => {
      return assets.map((item) => {
        let date = new Date(item.last_modified).toLocaleDateString();

        return {
          name: item.asset_name,
          size: Math.round(item.asset_size / 10) / 100,
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
    this.MediaManagementService.getMedia(this.filter).subscribe((res) => {
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
      this.mergeImages(res, name);
    });
  }

  protected mergeImages(url: string, name: string) {
    // QRCode.toDataURL('flaticon.com/123456789012=jlj;', {
    //   margin: 1,
    //   color: {
    //     dark: '#6A1B9A',
    //     light: '#69F0AE',
    //   },
    // }).then((qrUrl) => {
    //   this.MediaManagementService.mergeImages(url, this.localImage()).subscribe(
    //     (res) => {
    //       this.picUrl = res;
    //     }
    //   );
    // });
    this.getImgId(name).subscribe((res) => {
      this.LogoString(res).subscribe((res) => {
        this.MediaManagementService.mergeImages(url, res).subscribe((res) => {
          this.picUrl = res;
        });
      });
    });
  }

  protected getImgId(name: string): Observable<string> {
    return this.store.select(getListAssets).pipe(
      map((res) => {
        return res.find((item) => item.asset_name === name)?.asset_id ?? '';
      })
    );
  }

  protected LogoString(hash: string): Observable<string> {
    let img = new Image();
    img.src = String.raw`../../../assets/codeLogo.png`;

    return new Observable<string>((observer) => {
      img.onload = () => {
        let c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        let ctx = c.getContext('2d') ?? new CanvasRenderingContext2D();
        ctx.font = '50px Arial';
        ctx.drawImage(img, 0, 0);
        ctx.fillText(hash, 85, c.height - 10);
        observer.next(c.toDataURL());
        observer.complete();
      };
    });
  }
}
