import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './screens/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'home-page',
    loadChildren: () =>
      import('./screens/home-page/home-page.module').then(
        (m) => m.HomePageModule
      ),
  },
  {
    path: 'uploader',
    loadChildren: () =>
      import('./screens/uploader/uploader.module').then(
        (m) => m.UploaderModule
      ),
  },
  {
    path: 'media-finder',
    loadChildren: () =>
      import('./screens/media-finder/media-finder.module').then(
        (m) => m.MediaFinderModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
