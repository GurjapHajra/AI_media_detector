import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { AuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    loadChildren: () =>
      import('./screens/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'uploader',
    loadChildren: () =>
      import('./screens/uploader/uploader.module').then(
        (m) => m.UploaderModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'media-finder',
    loadChildren: () =>
      import('./screens/media-finder/media-finder.module').then(
        (m) => m.MediaFinderModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./screens/sign-up/sign-up.module').then((m) => m.SignUpModule),
    canActivate: [AuthGuard],
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
  {
    path: 'search',
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
