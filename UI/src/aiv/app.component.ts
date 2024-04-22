import { Component, OnInit } from '@angular/core';
import { MediaManagementService } from './services/media-management/media-management.service';
import { Hub } from 'aws-amplify/utils';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'NoAiVi';
  loading = false;
  hideSignUp: boolean = true;


  constructor(private mediaManagementService: MediaManagementService) { }

  ngOnInit() {
    Hub.listen('auth', ({ payload: { event } }) => {
      if (event === 'signedOut') {
        this.getValue();
      }
      else if (event === 'signedIn') {
        this.hideSignUp = true;
      }
    });
  }

  getValue() {
    if (this.mediaManagementService.isButtonClicked()) {
      const value = this.mediaManagementService.getShowCreateValue();
      console.log('Boolean value:', value);
      this.hideSignUp = value;
    }
    else {
      console.log('button not clicked!')
    }


  }
}
