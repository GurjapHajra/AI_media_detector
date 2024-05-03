import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Amplify } from 'aws-amplify';
import { signUp } from 'aws-amplify/auth';
import awsmobile from 'src/aws-exports';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'aiv-sign-up',
  standalone: true,
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButton,
    ReactiveFormsModule,
  ],
})
export class SignUpFormComponent {
  constructor() {
    Amplify.configure(awsmobile);
    this.profileForm.valueChanges.subscribe((value) => {
      console.log('valueChanges', value);
    });
  }

  profileForm: FormGroup = new FormGroup(
    {
      username: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      email: new FormControl('', [Validators.email]),
    },
    {
      validators: [
        (form) => {
          if (form.value.password !== form.value.confirmPassword) {
            this.profileForm.get('confirmPassword')?.setErrors({});
            return { message: "passwords don't match" };
          }
          return null;
        },
      ],
    }
  );

  handleSignUp(event: Event) {
    event.preventDefault();

    const username = this.profileForm.get('username')?.value;
    const password = this.profileForm.get('password')?.value;
    const email = this.profileForm.get('email')?.value;

    signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    }).then(
      (result) => {
        alert('Sign up successful!');
      },
      (error) => {
        console.log('Error signing up:', error);
      }
    );
  }
}
