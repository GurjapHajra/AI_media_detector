import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { addListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.actions';
import { getListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.selectors';
import { Observable, catchError, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-public-search',
  templateUrl: './public-search.component.html',
  styleUrl: './public-search.component.scss',
})
export class PublicSearchComponent {
  protected picUrl: string = '';
  protected assetid: string = '';

  protected searchResult = this.store.select(getListAssets).pipe(
    map((assets) => {
      return assets.map((item) => {
        return {
          name: item.asset_name,
        };
      });
    })
  );

  displayedColumns: string[] = ['name', 'view'];

  constructor(
    private store: Store,
    private MediaManagementService: MediaManagementService
  ) {}

  protected searched() {
    this.MediaManagementService.getAssetById(this.assetid).subscribe((res) => {
      console.log(res);
    });
  }

  protected openImage(key: string) {
    this.MediaManagementService.getAssetPreSignUrl(key).subscribe((res) => {
      take(1);
      this.picUrl = res.url;
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
    this.getAssetId(name).subscribe((id) => {
      this.joinLogoWithString(id).subscribe((res) => {
        this.MediaManagementService.mergeImages(url, res).subscribe((res) => {
          this.picUrl = res;
        });
      });
    });
  }

  protected getAssetId(name: string): Observable<string> {
    return this.store.select(getListAssets).pipe(
      map((res) => {
        return res.find((item) => item.asset_name === name)?.asset_id ?? '';
      })
    );
  }

  protected joinLogoWithString(hash: string): Observable<string> {
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
