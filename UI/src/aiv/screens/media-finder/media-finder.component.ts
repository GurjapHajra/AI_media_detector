import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';
import { addListAssets } from '@aiv/store/remote-assets-store/asset-store.actions';
import { getListAssets } from '@aiv/store/remote-assets-store/asset-store.selectors';

@Component({
  selector: 'app-media-finder',
  templateUrl: './media-finder.component.html',
  styleUrl: './media-finder.component.scss',
})
export class MediaFinderComponent {
  protected searchResult = this.store.select(getListAssets) ?? [];

  displayedColumns: string[] = ['name'];
  constructor(
    private store: Store,
    private MediaManagementService: MediaManagementService
  ) {}
  protected searched() {
    this.MediaManagementService.getMedia().subscribe((res) => {
      this.store.dispatch(addListAssets({ ListAssets: res }));
    });
  }
}
