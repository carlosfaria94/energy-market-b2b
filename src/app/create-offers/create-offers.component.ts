import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CreateOrdersComponent } from '../create-orders/create.component';
import { Web3Service } from '../util/web3.service';
import { MarketService } from '../util/market.service';
import { Order } from '../list-orders/list.component';

export interface DialogData {
  order: any;
  account: string;
  market: any;
}

@Component({
  selector: 'app-create-offers',
  templateUrl: './create-offers.component.html',
  styleUrls: ['./create-offers.component.css']
})
export class CreateOffersComponent implements OnInit {
  order: Order;
  market: any;
  submitting = false;
  account: string;
  userInput = {
    totalPrice: 0
  };

  constructor(
    private matSnackBar: MatSnackBar,
    private web3Service: Web3Service,
    private marketService: MarketService,
    public dialogRef: MatDialogRef<CreateOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.order = data.order;
    this.account = data.account;
    this.market = data.market;
  }

  ngOnInit() {}

  async submitOffer() {
    this.submitting = true;
    if (!this.market) {
      this.setStatus('Market contract is not loaded, unable to submit offer');
      this.submitting = false;
      return;
    }
    if (this.userInput.totalPrice <= 0) {
      this.setStatus('Total price is not set');
      this.submitting = false;
      return;
    }
    this.setStatus('Submiting offer, please wait');
    try {
      // TODO: Hash of the secret
      const ethPrice = await this.marketService.getEthPrice();
      const offerInEth = this.userInput.totalPrice / ethPrice;
      console.log('Setting with value of', offerInEth, 'ETH');
      const transaction = await this.market.submitOffer(
        this.order.id,
        this.userInput.totalPrice,
        '0x5df',
        {
          value: this.web3Service.web3.utils.toWei(
            offerInEth.toString(),
            'ether'
          ),
          from: this.account
        }
      );

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
      this.submitting = false;
      this.onNoClick();
    } catch (e) {
      console.log(e);
      this.setStatus(e.message + ' See log for more info');
      this.submitting = false;
      this.onNoClick();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setPrice(e) {
    const price = e.target.value;
    if (price >= 0) {
      this.userInput.totalPrice = e.target.value * this.order.quantity;
      console.log('Setting total price to: ' + this.userInput.totalPrice);
    }
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 5000 });
  }
}
