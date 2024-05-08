import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { getListAssets } from '@aiv/store/remote-assets-store/remote-asset-store.selectors';
import { Observable, map, take } from 'rxjs';
import { GetMediaListResponse } from '@aiv/models/api-reponse-types';

@Component({
  selector: 'app-public-search',
  templateUrl: './public-search.component.html',
  styleUrl: './public-search.component.scss',
})
export class PublicSearchComponent implements OnInit {
  protected picUrl: string = '';
  protected assetid: string = '';

  protected searchResults: any[] | undefined;

  private searchParams = new URLSearchParams(window.location.search);

  displayedColumns: string[] = ['name', 'value'];

  constructor(
    private store: Store,
    private MediaManagementService: MediaManagementService
  ) {}

  ngOnInit() {
    if (this.searchParams.has('assetid')) {
      this.assetid = this.searchParams.get('assetid') ?? '';
      this.searched();
    }
  }

  protected searched() {
    this.MediaManagementService.getAssetById(this.assetid).subscribe(
      (asset) => {
        let date = new Date(asset.last_modified).toLocaleDateString();

        this.searchResults = [
          { name: 'id', value: asset.asset_id },
          { name: 'name', value: asset.asset_name },
          { name: 'type', value: asset.asset_type },
          { name: 'size', value: asset.asset_size },
          { name: 'Last Modified', value: date },
          { name: 'upvotes', value: asset.upvotes },
          { name: 'downvotes', value: asset.downvotes },
          { name: 'p-hash', value: asset.p_hash },
          { name: 'verified', value: asset.verified },
        ];
      }
    );
  }

  protected openImage() {
    this.MediaManagementService.getAssetPreSignUrl(
      this.searchResults?.find((item) => item.name === 'name')?.value ?? ''
    ).subscribe((res) => {
      take(1);
      this.picUrl = res.url;
    });
  }

  protected mergeImages() {
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
    this.MediaManagementService.getAssetPreSignUrl(
      this.searchResults?.find((item) => item.name === 'name')?.value ?? ''
    ).subscribe((url) => {
      this.joinLogoWithString(
        this.searchResults?.find((item) => item.name === 'id')?.value ?? ''
      ).subscribe((res) => {
        this.MediaManagementService.mergeImages(url.url, res).subscribe(
          (res) => {
            this.picUrl = res;
          }
        );
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

  protected download() {
    var a = document.createElement('a'); //Create <a>
    a.href = this.picUrl; //Image Base64 Goes here
    a.download =
      this.searchResults?.find((item) => item.name === 'name')?.asset_id ??
      'image'; //File name Here
    a.click(); //Downloaded file
  }
}
