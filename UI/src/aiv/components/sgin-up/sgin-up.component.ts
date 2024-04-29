import { Component } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { signUp } from 'aws-amplify/auth';
import awsmobile from 'src/aws-exports';


@Component({
  selector: 'app-sgin-up',
  standalone: true,
  templateUrl: './sgin-up.component.html',
  styleUrl: './sgin-up.component.scss',
  imports: []
})
export class SginUpComponent {

  constructor() {
    Amplify.configure(awsmobile);
  }

  handleSignUp(event: Event) {
    event.preventDefault();

    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

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
        alert("Sign up successful!");
      },
      (error) => {
        console.log('Error signing up:', error);
      }
    );
  }
}