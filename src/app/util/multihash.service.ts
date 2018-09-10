import { Injectable } from '@angular/core';
import { decode, encode } from 'bs58';

declare const Buffer;

@Injectable()
export class MultihashService {
  /**
   * Multihash from: https://github.com/saurfang/ipfs-multihash-on-solidity/blob/master/src/multihash.js
   */

  constructor() {}

  /**
   * @typedef {Object} Multihash
   * @property {string} digest The digest output of hash function in hex with prepended '0x'
   * @property {number} hashFunction The hash function code for the function used
   * @property {number} size The length of digest
   */

  /**
   * Partition multihash string into object representing multihash
   *
   * @param {string} multihash A base58 encoded multihash string
   * @returns {Multihash}
   */
  getBytes32FromMultiash(multihash) {
    const decoded = decode(multihash);

    let digest = new Buffer(decoded.slice(2)).toString('hex');
    digest = '0x' + digest;

    return {
      // digest: `0x${decoded.slice(2).toString('hex')}`,
      // digest: '0x{new Buffer(decoded).toString('hex')}',
      digest: digest,
      hashFunction: decoded[0],
      size: decoded[1]
    };
  }

  /**
   * Encode a multihash structure into base58 encoded multihash string
   *
   * @param {Multihash} multihash
   * @returns {(string|null)} base58 encoded multihash string
   */
  getMultihashFromBytes32(digest, hashFunction, size) {
    if (size === 0) {
      return null;
    }

    // cut off leading "0x"
    const hashBytes = Buffer.from(digest.slice(2), 'hex');

    // prepend hashFunction and digest size
    const multihashBytes = hashBytes.constructor(2 + hashBytes.length);
    multihashBytes[0] = hashFunction;
    multihashBytes[1] = size;
    multihashBytes.set(hashBytes, 2);

    return encode(multihashBytes);
  }

  /**
   * Parse Solidity response in array to a Multihash object
   *
   * @param {array} response Response array from Solidity
   * @returns {Multihash} multihash object
   */
  parseContractResponse(response) {
    const [digest, hashFunction, size] = response;
    return {
      digest,
      hashFunction: hashFunction.toNumber(),
      size: size.toNumber()
    };
  }

  /**
   * Parse Solidity response in array to a base58 encoded multihash string
   *
   * @param {array} response Response array from Solidity
   * @returns {string} base58 encoded multihash string
   */
  getMultihashFromContractResponse(response) {
    const res = this.parseContractResponse(response);
    return this.getMultihashFromBytes32(res.digest, res.hashFunction, res.size);
  }
}
