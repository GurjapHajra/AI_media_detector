import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmSignUpComponent } from './confirm-sign-up.component';

const routes: Routes = [{ path: '', component: ConfirmSignUpComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmSignUpRoutingModule { }
