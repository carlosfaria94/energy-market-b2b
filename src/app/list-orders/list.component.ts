import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { ListOffersComponent } from '../list-offers/list-offers.component';
import { CreateOffersComponent } from '../create-offers/create-offers.component';

export interface Order {
  type: string;
  id: number;
  origin: string;
  quantity: number;
  product: string;
  created: string;
  offersCount: number;
  state: string;
}

@Component({
  selector: 'app-list-orders',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListOrdersComponent implements OnInit {
  displayedColumns = [
    'type',
    'id',
    'created',
    'product',
    'quantity',
    'origin',
    'offersCount',
    'seeOffers',
    'placeOffer'
  ];
  dataSource = new MatTableDataSource<Order>(ORDER_DATA);

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(public dialog: MatDialog) {}

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {}

  openListOffers(order): void {
    const dialogRef = this.dialog.open(ListOffersComponent, {
      width: '900px',
      data: {
        order: order
      }
    });
  }

  openCreateOffers(order): void {
    const dialogRef = this.dialog.open(CreateOffersComponent, {
      width: '500px',
      data: {
        order: order
      }
    });
  }
}

const ORDER_DATA: Order[] = [
  {
    type: 'Buy',
    id: 1,
    origin: 'Coopérnico',
    quantity: 10,
    product: 'Day ahead',
    created: '09/09/18',
    offersCount: 2,
    state: 'Open'
  },
  {
    type: 'Buy',
    id: 2,
    origin: 'Coopérnico',
    quantity: 10,
    product: 'Day ahead',
    created: '09/09/18',
    offersCount: 2,
    state: 'Open'
  },
  {
    type: 'Buy',
    id: 3,
    origin: 'Coopérnico',
    quantity: 10,
    product: 'Day ahead',
    created: '09/09/18',
    offersCount: 2,
    state: 'Open'
  },
  {
    type: 'Buy',
    id: 4,
    origin: 'Coopérnico',
    quantity: 10,
    product: 'Day ahead',
    created: '09/09/18',
    offersCount: 2,
    state: 'Open'
  },
  {
    type: 'Buy',
    id: 5,
    origin: 'Coopérnico',
    quantity: 10,
    product: 'Day ahead',
    created: '09/09/18',
    offersCount: 2,
    state: 'Open'
  },
  {
    type: 'Buy',
    id: 6,
    origin: 'Coopérnico',
    quantity: 10,
    product: 'Day ahead',
    created: '09/09/18',
    offersCount: 2,
    state: 'Open'
  },
  {
    type: 'Buy',
    id: 7,
    origin: 'Coopérnico',
    quantity: 10,
    product: 'Day ahead',
    created: '09/09/18',
    offersCount: 2,
    state: 'Open'
  },
  {
    type: 'Buy',
    id: 8,
    origin: 'Coopérnico',
    quantity: 10,
    product: 'Day ahead',
    created: '09/09/18',
    offersCount: 2,
    state: 'Open'
  }
];
