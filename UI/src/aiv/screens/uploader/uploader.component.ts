import { Component } from '@angular/core';
import { AssetFile } from 'src/aiv/models/asset-file';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  assets: AssetFile[] | undefined;

  assetDropped(assets: AssetFile[]) {
    this.assets = assets;
  }
}
