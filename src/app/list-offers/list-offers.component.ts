import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { ListOrdersComponent, Order } from '../list-orders/list.component';

export interface DialogData {
  order: any;
}

export interface Offer {
  type: string;
  id: number;
  origin: string;
  quantity: number;
  price: number;
  product: string;
  created: string;
}

@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent implements OnInit {
  order: Order;
  displayedColumns = [
    'type',
    'id',
    'created',
    'product',
    'quantity',
    'price',
    'origin'
  ];
  dataSource = new MatTableDataSource<Offer>(OFFER_DATA);

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<ListOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.order = data.order;
  }

  ngOnInit() {}

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

const OFFER_DATA: Offer[] = [
  {
    type: 'Buy',
    id: 10,
    origin: 'Energia Simples',
    quantity: 10,
    price: 10000,
    product: 'Day ahead',
    created: '09/09/18'
  },
  {
    type: 'Buy',
    id: 11,
    origin: 'Boa Energia',
    quantity: 10,
    price: 12000,
    product: 'Day ahead',
    created: '09/09/18'
  }
];
