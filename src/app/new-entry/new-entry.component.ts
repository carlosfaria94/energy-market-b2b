import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import { IpfsService } from '../util/ipfs.service';
import { MultihashService } from '../util/multihash.service';
import { UPortService } from '../util/u-port.service';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.css']
})
export class NewEntryComponent implements OnInit {
  account = '';
  organisation: any;
  spec = {
    description: '',
    bounty: 0,
    additionalFile: '',
    uPortName: '',
    uPortAvatar: ''
  };
  creatingBounty = false;
  fileToUpload: any;

  constructor(
    private web3Service: Web3Service,
    private matSnackBar: MatSnackBar,
    private ipfsService: IpfsService,
    private multihashService: MultihashService,
    private uPortService: UPortService
  ) {}

  ngOnInit(): void {
    this.watchAccount();
    this.web3Service
      .artifactsToContract(this.web3Service.organisationArtifacts)
      .then(organisationAbstraction => {
        this.organisation = organisationAbstraction;
      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe(accounts => {
      this.account = accounts[0];
    });
  }

  async createBounty() {
    this.creatingBounty = true;
    if (!this.organisation) {
      this.setStatus(
        'organisation contract is not loaded, unable to create a bounty'
      );
      return;
    }
    if (!this.spec.bounty) {
      this.setStatus('Bounty is not set');
      return;
    }
    if (this.spec.description === '') {
      this.setStatus('Description is not set');
      return;
    }
    this.setStatus('Creating bounty, please wait');
    // Lets set the uPort name and avatar to be saved in the entry Spec
    this.setUportCredentials();
    try {
      if (this.fileToUpload) {
        const additionalFile = await this.ipfsService.uploadFile(
          this.fileToUpload
        );
        // Add the IPFS file hash on the entry specification
        this.spec.additionalFile = additionalFile;
      } else {
        delete this.spec.additionalFile;
      }
      const specHash = await this.ipfsService.uploadObject(this.spec);
      const specMultiHash = this.multihashService.getBytes32FromMultiash(
        specHash
      );
      const deployedOrganisation = await this.organisation.deployed();
      const transaction = await deployedOrganisation.addEntry.sendTransaction(
        specMultiHash.digest,
        specMultiHash.hashFunction,
        specMultiHash.size,
        {
          value: this.web3Service.web3.utils.toWei(this.spec.bounty, 'ether'),
          from: this.account
        }
      );

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
      this.creatingBounty = false;
    } catch (e) {
      console.log(e);
      this.setStatus(e.message + ' See log for more info');
      this.creatingBounty = false;
    }
  }

  setUportCredentials() {
    const credentials = this.uPortService.credentials;
    if (!credentials) {
      return;
    }
    if (credentials.avatar.uri) {
      this.spec.uPortAvatar = credentials.avatar.uri;
    }
    if (credentials.name) {
      this.spec.uPortName = credentials.name;
    }
  }

  setBounty(e) {
    console.log('Setting amount: ' + e.target.value);
    this.spec.bounty = e.target.value;
  }

  setDescription(e) {
    console.log('Setting spec description: ' + e.target.value);
    this.spec.description = e.target.value;
  }

  handleFileInput(e) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      this.fileToUpload = reader.result;
    };
    reader.readAsArrayBuffer(e.files[0]);
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 5000 });
  }
}
