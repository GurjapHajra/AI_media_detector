import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { addListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.actions';
import { getListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.selectors';
import { Observable, catchError, map, switchMap, take } from 'rxjs';

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
      if (!assets) {
        return [];
      }

      return assets.map((item) => {
        let date = new Date(item.last_modified).toLocaleDateString();

        return {
          id: item.asset_id,
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
    'delete',
  ];

  constructor(
    private store: Store,
    private MediaManagementService: MediaManagementService
  ) {}

  protected searched() {
    this.MediaManagementService.getAssetListFromDb(this.filter)
      .pipe(take(1))
      .subscribe((assets) => {
        this.store.dispatch(addListAssets({ ListAssets: assets }));
      });
  }

  protected openImage(key: string) {
    this.MediaManagementService.getAssetPreSignUrl(key)
      .pipe(take(1))
      .subscribe((res) => {
        this.picUrl = res.url;
      });
  }

  protected verify(name: string) {
    // getBase64FromAssetName Observable does complete
    this.MediaManagementService.getBase64FromAssetName(name)
      .pipe(take(1))
      .subscribe((res) => this.mergeImages(res, name));
  }
  // ************** move this to effect **************
  protected deleteMedia(name: string) {
    this.store
      .select(getListAssets)
      .pipe(
        take(1),
        map((res) => {
          return res.find((item) => item.asset_name === name)?.asset_id ?? '';
        }),
        switchMap((asset_id) => {
          return this.MediaManagementService.deleteMedia(asset_id);
        }),
        map(() => {
          this.searched();
          alert('Successfully deleted!');
        }),
        catchError((err) => {
          alert('Error: ' + err.error.message);
          return err;
        })
      )
      .subscribe();
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

    this.getAssetId(name)
      .pipe(take(1))
      .subscribe((id) => {
        // joinLogoWithString Observable does complete
        this.joinLogoWithString(id).subscribe((res) => {
          // mergeImages Observable does complete
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
