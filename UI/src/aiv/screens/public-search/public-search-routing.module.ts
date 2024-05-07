import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicSearchComponent } from './public-search.component';

const routes: Routes = [{ path: '', component: PublicSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicSearchRoutingModule { }
