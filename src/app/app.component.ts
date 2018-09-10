import { Component } from '@angular/core';

import { MatSnackBar } from '@angular/material';
import { UPortService } from './util/u-port.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  credentials: any;

  constructor(
    private matSnackBar: MatSnackBar,
    private uPortService: UPortService
  ) {}

  async uPortLogin() {
    try {
      await this.uPortService.requestCredentials();
      this.credentials = this.uPortService.credentials;
      if (this.credentials.name) {
        this.setStatus(
          `${this.credentials.name} welcome to the best bounty dApp`
        );
      }
      console.log(this.credentials);
    } catch (e) {
      console.error(e);
      this.setStatus(e.message);
    }
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 5000 });
  }
}
