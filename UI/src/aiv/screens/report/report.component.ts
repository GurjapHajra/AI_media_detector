import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalAlertService } from '@aiv/services/alert/swal-alert.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent {
  reportForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    message: new FormControl(''),
  });

  constructor(
    private httpClient: HttpClient,
    private swalAlertService: SwalAlertService
  ) {}

  public sendEmail(e: Event) {
    e.preventDefault();

    let formData = new FormData();
    if (this.reportForm.invalid) {
      return;
    }
    formData.append('name', this.reportForm.get('name')?.value);
    formData.append('email', this.reportForm.get('email')?.value);
    formData.append('message', this.reportForm.get('message')?.value);

    formData.append('service_id', 'service_h8qt39c');
    formData.append('template_id', 'template_aw78jph');
    formData.append('user_id', 'ma6XvIdm8P5jP8Z8P');

    this.httpClient
      .post('https://api.emailjs.com/api/v1.0/email/send-form', formData)
      .subscribe(
        (response) => {
          console.log(response);
          this.reportForm.reset();
          this.swalAlertService.showAlertSimple('Report sent successfully');
        },
        (error) => {
          console.log(error);
          this.reportForm.reset();
          this.swalAlertService.showAlertSimple('Report sent successfully');
        }
      );
  }
}
