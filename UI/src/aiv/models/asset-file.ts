import { SafeUrl } from '@angular/platform-browser';

export interface AssetFile {
  file: File;
  url?: SafeUrl;
  Hash?: string;
  Base64?: string;
}
