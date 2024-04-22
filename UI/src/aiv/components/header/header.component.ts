import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MediaManagementService } from '@aiv/services/media-management/media-management.service';

@Component({
  selector: 'aiv-header',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() signout = new EventEmitter<void>();
  //@Output() showCreate = new EventEmitter<boolean>();
  //showCreate: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router, private mediaManagementService: MediaManagementService) { }

  onHomeClick() {
    this.router.navigate(['/']);
  }

  createAccount(value: boolean) {
    //this.showCreate.emit(value);
    this.mediaManagementService.setShowCreateValue(value);
    this.signout.emit();
    //console.log("clicked")
    //this.router.navigate(["/sgin-up"]);
  }
}
