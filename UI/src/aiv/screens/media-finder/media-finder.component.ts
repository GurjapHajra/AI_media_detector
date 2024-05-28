import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import * as fromRemoteAssetStore from '@aiv/store/remote-assets-store/remote-asset-store.actions';
import { Observable, map, take, startWith } from 'rxjs';
import {
  getIsDeleting,
  getListAssets,
} from '@aiv/store/remote-assets-store/remote-asset-store.selectors';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { searchResults } from '@aiv/models/SearchResultsModel';

@Component({
  selector: 'app-media-finder',
  templateUrl: './media-finder.component.html',
  styleUrls: ['./media-finder.component.scss'],
})
export class MediaFinderComponent {
  protected picUrl: string = '';
  protected assetName: string = '';
  protected filter: string = '';
  protected loading: boolean = false;
  protected viewLoading: { [key: string]: boolean } = {};
  protected deleteLoading: Observable<{ name: string; status: boolean }> =
    this.store.select(getIsDeleting);
  protected verifyLoading: { [key: string]: boolean } = {};

  protected searchResult: Observable<
    {
      id: string;
      name: string;
      size: number;
      LastModified: string;
      verified: boolean;
    }[]
  > = this.store.select(getListAssets).pipe(
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
          verified: item.verified,
        };
      });
    }),
    startWith([]) // Ensure the observable emits an empty array initially
  );

  displayedColumns: string[] = [
    'name',
    'size',
    'LastModified',
    'view',
    'verify',
    'delete',
  ];

  getAssetIsVerified(): Observable<boolean> {
    return this.store.select(getListAssets).pipe(
      map((res) => {
        return (
          res.find((item) => item.asset_name === this.assetName)?.verified ??
          false
        );
      })
    );
  }

  constructor(
    private store: Store,
    private MediaManagementService: MediaManagementService,
    private swalAlertService: SwalAlertService
  ) {}

  protected searched() {
    this.loading = true;
    this.MediaManagementService.getAssetListFromDb(this.filter)
      .pipe(take(1))
      .subscribe(
        (assets) => {
          this.store.dispatch(
            fromRemoteAssetStore.addListAssets({ ListAssets: assets })
          );
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.swalAlertService.showIconAlert(
            'Oops...',
            'Something went wrong!',
            error,
            'error'
          );
        }
      );
  }

  protected openImage(key: string) {
    this.assetName = key;
    this.viewLoading[key] = true;
    this.MediaManagementService.getAssetPreSignUrl(key)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.picUrl = res.url;
          this.viewLoading[key] = false;
        },
        () => {
          this.viewLoading[key] = false;
        }
      );
  }

  protected verify(asset: searchResults) {
    // getBase64FromAssetName Observable does complete
    this.verifyLoading[asset.name] = true;
    if (asset.verified) {
      this.MediaManagementService.getBase64FromAssetName(asset.name)
        .pipe(take(1))
        .subscribe((res) => this.mergeImages(res, asset.name));
      this.verifyLoading[asset.name] = false;
    } else {
      this.MediaManagementService.checkForAI(asset.name).subscribe((res) => {
        console.log('is ai: ', res.type.ai_generated);
        if (res.type.ai_generated < 0.8) {
          this.store.dispatch(
            fromRemoteAssetStore.verifyAsset({ assetId: asset.id })
          );
          this.MediaManagementService.getBase64FromAssetName(asset.name)
            .pipe(take(1))
            .subscribe(
              (res) => {
                this.mergeImages(res, asset.name);
                this.verifyLoading[asset.name] = false;
              },
              () => {
                this.verifyLoading[asset.name] = false;
              }
            );
          this.store.dispatch(
            fromRemoteAssetStore.verifySuccess({ assetId: asset.id })
          );
        } else {
          this.swalAlertService.showIconAlert(
            'AI Generated Image',
            'This image is AI generated',
            '',
            'error'
          );
          this.openImage(asset.name);
          this.verifyLoading[asset.name] = false;
        }
      });
    }
  }

  protected viewVerify() {
    this.MediaManagementService.getBase64FromAssetName(this.assetName)
      .pipe(take(1))
      .subscribe((res) => this.mergeImages(res, this.assetName));
  }

  protected deleteMedia(name: string) {
    this.store.dispatch(fromRemoteAssetStore.deleteAsset({ assetName: name }));
  }

  protected mergeImages(url: string, name: string) {
    this.getAssetId(name)
      .pipe(take(1))
      .subscribe((id) => {
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

  protected download() {
    var a = document.createElement('a');
    a.href = this.picUrl;
    a.download = 'image';
    a.click();
    this.swalAlertService.showAlertSimple('Image Downloading');
  }

  protected clearImage() {
    this.picUrl = '';
    this.assetName = '';
  }
}
