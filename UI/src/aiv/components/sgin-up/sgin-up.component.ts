import { Component } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { signUp } from 'aws-amplify/auth';
import awsmobile from 'src/aws-exports';


type SignUpParameters = {
  username: string;
  password: string;
  email: string;
};

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

  handleSignUp() {
    async function handleSignUp({
      username,
      password,
      email
    }: SignUpParameters) {
      try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
          username,
          password,
          options: {
            userAttributes: {
              email
            },
            // optional
            //   autoSignIn: true // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
          }
        });
        console.log('name: ', username + 'email: ', email);
        console.log(userId);
      } catch (error) {
        console.log('error signing up:', error);
      }
    }

  }


}

