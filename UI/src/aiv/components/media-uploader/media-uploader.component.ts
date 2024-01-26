import { Component } from '@angular/core';
import { ImageFile } from 'src/aiv/models/image-file';

@Component({
  selector: 'aiv-media-uploader',
  templateUrl: './media-uploader.component.html',
  styleUrls: ['./media-uploader.component.scss'],
})
export class MediaUploaderComponent {
  files: ImageFile[] = [];

  onDropFiles(files: ImageFile[]): void {
    this.files = [...this.files, ...files];
  }
}
