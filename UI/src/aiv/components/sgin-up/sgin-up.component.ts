import { Component, OnInit } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { signUp } from 'aws-amplify/auth';
import awsmobile from 'src/aws-exports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-sgin-up',
  standalone: true,
  templateUrl: './sgin-up.component.html',
  styleUrl: './sgin-up.component.scss',
  imports: []
})
export class SginUpComponent implements OnInit {

  signupForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    // Amplify.configure(awsmobile);
  }

  ngOnInit(): void {
    Amplify.configure(awsmobile);

    this.signupForm = this.fb.group({ // Use FormBuilder to create FormGroup
      username: ['', Validators.required], // Set initial value to empty string, add Validators.required
      password: ['', Validators.required], // Set initial value to empty string, add Validators.required
      confirmPassword: ['', Validators.required], // Set initial value to empty string, add Validators.required
      email: ['', [Validators.required, Validators.email]] // Set initial value to empty string, add Validators.required and Validators.email
    });
  }

  handleSignUp() {
    if (this.signupForm.valid) { // Check if the form is valid
      const { username, password, email } = this.signupForm.value;
      signUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      }).then(
        (result) => {
          console.log('Sign up successful:', result);
        },
        (error) => {
          console.log('Error signing up:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}