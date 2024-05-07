import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicSearchRoutingModule } from './public-search-routing.module';
import { PublicSearchComponent } from './public-search.component';


@NgModule({
  declarations: [
    PublicSearchComponent
  ],
  imports: [
    CommonModule,
    PublicSearchRoutingModule
  ]
})
export class PublicSearchModule { }
