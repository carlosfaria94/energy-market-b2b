import { Injectable } from '@angular/core';
import { Connect, SimpleSigner } from 'uport-connect';

@Injectable()
export class UPortService {
  uport: any;
  public credentials: any;

  constructor() {
    // We should NEVER put the signer in plaintext, but this is only a demo dApp
    this.uport = new Connect("Carlos Faria's bounty dApp", {
      clientId: '2owsZg8RnhWnjZ5yjeRETET1yG7fEwiHhwY',
      network: 'rinkeby',
      signer: SimpleSigner(
        '3ae5a32eb815b08cf44aa13d64b7937d468828c016018a506689d09b61e0cb98'
      )
    });
  }

  async requestCredentials() {
    try {
      // Credentials object: https://developer.uport.me/requestcredentials#calling-the-request-method
      this.credentials = await this.uport.requestCredentials({
        requested: ['name', 'avatar']
      });
    } catch (e) {
      throw e;
    }
  }
}
