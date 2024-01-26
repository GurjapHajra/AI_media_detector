import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageRoutingModule } from './home-page-routing.module';
import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, HomePageRoutingModule],
})
export class HomePageModule {
  routes: Routes = [
    {
      path: '',
      component: HomePageComponent,
    },
  ];
}
