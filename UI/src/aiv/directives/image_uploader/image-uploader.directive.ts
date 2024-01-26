import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { ImageFile } from '../../models/image-file';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[corpImgUpload]',
})
export class ImageUploaderDirective {
  constructor(private sanitizer: DomSanitizer) {}

  @Output() dropFiles: EventEmitter<ImageFile[]> = new EventEmitter();
  @HostBinding('style.background') backgroundColor: string = '#C6E4F1';

  @HostListener('dragover', ['$event']) public dragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Over;
  }

  @HostListener('dragleave', ['$event']) public dragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Default;
  }

  @HostListener('drop', ['$event']) public drop(event: DragEvent) {
    console.log(':::', event.dataTransfer?.files);

    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Default;

    let fileList = event.dataTransfer?.files ?? [];
    let files: ImageFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file)
      );
      files.push({ file, url });
    }
    if (files.length > 0) {
      this.dropFiles.emit(files);
    }
  }
}

enum DropColor {
  Default = '#C6E4F1',
  Over = '#ACADAD',
}
