import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Amplify } from 'aws-amplify';
import { signIn } from 'aws-amplify/auth';
import awsmobile from 'src/aws-exports';

import { Store } from '@ngrx/store';

import * as fromAuth from '@aiv/store/auth-store/auth-store.actions';
import { SwalAlertService } from '../../services/alert/swal-alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  profileForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private router: Router,
    private store: Store,
    private swalAlertService: SwalAlertService
  ) {
    Amplify.configure(awsmobile);
  }

  handleSignIn(event: Event) {
    event.preventDefault();

    const username = this.profileForm.get('username')?.value;
    const password = this.profileForm.get('password')?.value;

    signIn({ username, password })
      .then((user) => {
        this.store.dispatch(
          fromAuth.signInUser({
            user: {
              loggedIn: true,
              username: username,
              userId: 'asdfasd',
            },
          })
        );
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.swalAlertService.showIconAlert('Oops...', 'Something went wrong!', 'Please check your Username and Password', 'error')
      });
  }
}
