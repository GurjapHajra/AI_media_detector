import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { getUser } from '@aiv/store/auth-store/auth-store.selectors';

import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
@Component({
  selector: 'aiv-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() signout = new EventEmitter<void>();
  @Output() signin = new EventEmitter<void>();

  loggedIn = this.store.select(getUser).pipe(map((user) => user.loggedIn));

  constructor(private router: Router, private store: Store) {}

  GoToHome() {
    this.router.navigate(['/home']);
  }

  GoToSeach() {
    this.router.navigate(['/search']);
  }

  createAccount() {
    this.router.navigate(['/sign-up']);
  }
}
