import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    AmplifyAuthenticatorModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButton,
    ReactiveFormsModule,
    MatCardModule,
  ],
})
export class LoginModule {}
