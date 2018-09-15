import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  credentials: any;

  constructor(private matSnackBar: MatSnackBar) {}

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 5000 });
  }
}
