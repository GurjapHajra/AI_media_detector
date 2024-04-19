import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { AppComponent } from './app.component';
import { SginUpComponent } from './components/sgin-up/sgin-up.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    loadChildren: () =>
      import('./screens/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'sgin-up',
    component: SginUpComponent
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
  {
    path: 'media-finder',
    loadChildren: () =>
      import('./screens/media-finder/media-finder.module').then(
        (m) => m.MediaFinderModule
      ),
  },
  { path: 'uploader', loadChildren: () => import('./screens/uploader/uploader.module').then(m => m.UploaderModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
