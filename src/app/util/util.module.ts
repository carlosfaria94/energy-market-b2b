import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './web3.service';
import { MultihashService } from './multihash.service';
import { IpfsService } from './ipfs.service';
import { UPortService } from './u-port.service';

@NgModule({
  imports: [CommonModule],
  providers: [Web3Service, MultihashService, IpfsService, UPortService],
  declarations: []
})
export class UtilModule {}
