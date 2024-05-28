import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { resendSignUpCode, confirmSignUp } from 'aws-amplify/auth';
import { SwalAlertService } from '@aiv/services/alert/swal-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-sign-up',
  templateUrl: './confirm-sign-up.component.html',
  styleUrl: './confirm-sign-up.component.scss',
})
export class ConfirmSignUpComponent {
  profileForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    code: new FormControl(''),
  });

  resendForm: FormGroup = new FormGroup({
    username: new FormControl(''),
  });

  constructor(
    private swalAlertService: SwalAlertService,
    private router: Router
  ) {}

  handleConfirmSignUp(event: Event) {
    event.preventDefault();
    confirmSignUp({
      username: this.profileForm.get('username')?.value,
      confirmationCode: this.profileForm.get('code')?.value,
    })
      .then((res) => {
        this.router.navigate(['/login']);
        this.swalAlertService.showAlertSimple('Success: ' + res);
      })
      .catch((error) => {
        this.swalAlertService.showAlertSimple('Error: ' + error);
      });
  }

  handleResendCode(event: Event) {
    event.preventDefault();
    resendSignUpCode({ username: this.resendForm.get('username')?.value })
      .then((res) => {
        this.swalAlertService.showAlertSimple('Success: ' + res);
      })
      .catch((error) => {
        this.swalAlertService.showAlertSimple('Error: ' + error);
      });
  }
}
