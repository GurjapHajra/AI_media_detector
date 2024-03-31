import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaFinderComponent } from './media-finder.component';

const routes: Routes = [{ path: '', component: MediaFinderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaFinderRoutingModule { }
