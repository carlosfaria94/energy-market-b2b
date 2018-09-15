import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreateOrdersComponent } from '../create-orders/create.component';

export interface DialogData {
  order: any;
}

@Component({
  selector: 'app-create-offers',
  templateUrl: './create-offers.component.html',
  styleUrls: ['./create-offers.component.css']
})
export class CreateOffersComponent implements OnInit {
  order: any;

  constructor(
    public dialogRef: MatDialogRef<CreateOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.order = data.order;
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
