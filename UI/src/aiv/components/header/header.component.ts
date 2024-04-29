import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'aiv-header',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() signout = new EventEmitter<void>();


  constructor(private router: Router) { }

  onHomeClick() {
    this.router.navigate(['/']);
  }

  createAccount() {
    this.router.navigate(["/sgin-up"]);
  }
}
