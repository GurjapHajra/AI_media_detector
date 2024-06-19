import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmSignUpRoutingModule } from './confirm-sign-up-routing.module';
import { ConfirmSignUpComponent } from './confirm-sign-up.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [ConfirmSignUpComponent],
  imports: [
    CommonModule,
    ConfirmSignUpRoutingModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButton,
    ReactiveFormsModule,
  ],
})
export class ConfirmSignUpModule {}
