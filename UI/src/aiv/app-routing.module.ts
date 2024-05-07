import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    loadChildren: () =>
      import('./screens/home/home.module').then((m) => m.HomeModule),
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
  {
    path: 'uploader',
    loadChildren: () =>
      import('./screens/uploader/uploader.module').then(
        (m) => m.UploaderModule
      ),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./screens/sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./screens/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./screens/public-search/public-search.module').then(
        (m) => m.PublicSearchModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
