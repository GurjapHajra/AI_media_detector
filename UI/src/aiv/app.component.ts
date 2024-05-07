import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';

import { Store } from '@ngrx/store';
import * as fromAuth from './store/auth-store/auth-store.actions';
import { signOutUser } from './store/auth-store/auth-store.actions';
import { signInUser } from './store/auth-store/auth-store.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'NoAiVi';

  constructor(private router: Router, private store: Store) {}

  ngOnInit() {
    getCurrentUser()
      .then((user) => {
        this.store.dispatch(
          signInUser({
            user: {
              loggedIn: true,
              username: user.username,
              userId: user.userId,
            },
          })
        );
      })
      .catch((e) => {
        this.store.dispatch(fromAuth.signOutUser());
      });
  }

  signIn() {
    this.router.navigate(['/login']);
  }

  signOut() {
    signOut().then((val) => {
      this.router.navigate(['/']);
      this.store.dispatch(fromAuth.signOutUser());
    });
  }
}
