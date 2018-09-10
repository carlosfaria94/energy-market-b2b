import { Injectable } from '@angular/core';
import * as IPFS from 'ipfs-api';

declare const Buffer;

@Injectable()
export class IpfsService {
  ipfs: any;

  constructor() {
    this.ipfs = new IPFS({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    });
  }

  async uploadObject(obj: object) {
    console.log('Uploading an object to IPFS:', obj);
    const data = Buffer.from(JSON.stringify(obj));
    const result = await this.ipfs.files.add(data);
    console.log('Object hash from IPFS:', result[0].hash);
    return result[0].hash;
  }

  async getObject(hash) {
    const buf = await this.ipfs.files.cat(`/ipfs/${hash}`);
    let obj;
    try {
      obj = JSON.parse(buf.toString());
    } catch (e) {
      throw new Error(`Could not get object from the hash: ${hash}`);
    }
    return obj;
  }

  async uploadFile(data) {
    console.log('Uploading a file to IPFS');
    const buf = Buffer.from(data);
    const result = await this.ipfs.add(buf);
    console.log('File hash from IPFS:', result[0].hash);
    return result[0].hash;
  }
}
