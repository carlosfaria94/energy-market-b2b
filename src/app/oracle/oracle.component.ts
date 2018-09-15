import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar, MatDialog } from '@angular/material';

@Component({
  selector: 'app-oracle',
  templateUrl: './oracle.component.html',
  styleUrls: ['./oracle.component.css']
})
export class OracleComponent implements OnInit {
  account: string;
  ethPriceOracle: any;
  price = 0;

  constructor(
    private web3Service: Web3Service,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.watchAccount();
    // this.setContract();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe(accounts => {
      this.account = accounts[0];
    });
  }

  async setContract() {
    try {
      /* const contract = await this.web3Service.artifactsToContract(
        this.web3Service.oracleArtifacts
      );
      this.ethPriceOracle = await contract.deployed(); */
    } catch (e) {
      console.log(e);
      this.setStatus(e.message + ' See log for more info');
    }
  }

  async getEthPrice() {
    if (!this.ethPriceOracle) {
      this.setStatus(
        'EthPriceOracle contract is not loaded, unable to get the ETH price'
      );
      return;
    }
    this.setStatus('Getting the ETH price, please wait');
    try {
      const price = await this.ethPriceOracle.getEthPrice();
      this.price = price.toNumber();
      console.log('Getting ETH price', this.price);
    } catch (e) {
      console.log(e);
      this.setStatus(e.message + ' See log for more info');
    }
  }

  async updatePrice() {
    if (!this.ethPriceOracle) {
      this.setStatus(
        'EthPriceOracle contract is not loaded, unable to get the ETH price'
      );
      return;
    }
    this.setStatus('Updating the ETH price, please wait');
    try {
      const response = await fetch(
        'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=EUR'
      );
      const res = await response.json();
      const price = res[0].price_eur;
      console.log('Updating ETH/EUR price to:', price);
      await this.ethPriceOracle.setEthEurPrice(price, {
        from: this.account
      });
    } catch (e) {
      console.error(e);
      this.setStatus(e.message + ' See log for more info');
    }
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 5000 });
  }
}
