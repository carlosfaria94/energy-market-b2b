import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  credentials: any;
  isPublic = false;
  isSimulation = false;

  constructor(private matSnackBar: MatSnackBar) {}

  goPublic() {
    if (this.isPublic) {
      console.log('Going private...');
      this.isPublic = false;
    } else {
      console.log('Going public...');
      this.isPublic = true;
    }
  }

  goSimulation() {
    if (this.isSimulation) {
      console.log('Going to simulation...');
      this.isSimulation = false;
    } else {
      console.log('Going to market...');
      this.isSimulation = true;
    }
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 5000 });
  }
}
