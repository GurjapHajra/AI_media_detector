import { Component, EventEmitter, Output } from '@angular/core';
import { AssetFile } from 'src/aiv/models/asset-file';

@Component({
  selector: 'aiv-media-uploader',
  templateUrl: './media-uploader.component.html',
  styleUrls: ['./media-uploader.component.scss'],
})
export class MediaUploaderComponent {
  @Output() imageDroped = new EventEmitter<AssetFile[]>();

  onDropFiles(files: AssetFile[]): void {
    this.imageDroped.emit([...files]);
  }
}
