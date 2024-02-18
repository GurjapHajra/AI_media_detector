import { Component, EventEmitter, Output } from '@angular/core';
import { AssetFile } from 'src/aiv/models/asset-file';

@Component({
  selector: 'aiv-media-uploader',
  templateUrl: './media-uploader.component.html',
  styleUrls: ['./media-uploader.component.scss'],
})
export class MediaUploaderComponent {
  files: AssetFile[] = [];

  @Output() imageDroped = new EventEmitter<AssetFile[]>();

  onDropFiles(files: AssetFile[]): void {
    this.files = [...this.files, ...files];
    this.imageDroped.emit(this.files);
  }
}
