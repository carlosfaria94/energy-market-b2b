/*jshint esversion: 6 */
const fs = require('fs');
const path = require('path');

const Eth = require('web3-eth');
const solc = require('solc');

console.log('index file running');

const TOKENS_INTERFACE = fs.readFileSync(path.join(__dirname, 'ContractInterface.sol'),{ encoding: 'utf8' });
const TOKEN_CONTRACT = solc.compile(TOKENS_INTERFACE, 1);

const getEthObj = (providerHost) => new Eth(Eth.givenProvider || providerHost);
const getTokenContract = (eth,tokenAddress) => {
    const tokenInterface = JSON.parse(TOKEN_CONTRACT.contracts[':Token'].interface)

    const token = new eth.Contract(tokenInterface, tokenAddress);
    return token
}

const getOwnerTokens = async (eth,tokenAddress,escrowAddress) => {
    const token = getTokenContract(eth,tokenAddress)
    const tokenIds = await token.methods.getTokensOwnedBy(escrowAddress).call()
    return tokenIds
};

const getTokensURI = async (eth, tokenAddress, tokenIds) => {
    const token = getTokenContract(eth,tokenAddress)
    const tokenURIPromises = tokenIds.map(tId => token.methods.tokenURI(tId).call())
    return await Promise.all(tokenURIPromises)
}

const signURIs = (eth, privateKey, tokenURIs) => {
    //const prefix = '\x19Ethereum Signed Message:\n32'
    //utils.sha3(prefix+sig.message.length+sig.message)
    const wallet = eth.accounts.wallet.add(privateKey);
    const signedTokenURIs = tokenURIs.map(uri => wallet.sign(uri).signature)
    return signedTokenURIs
}

const recoverURISigner = (eth, tokenURIs, signedTokenURIs) => {
    const tokenURIsigners = tokenURIs.map((uri,idx) => eth.accounts.recover(tokenURIs[idx], signedTokenURIs[idx]))
    return tokenURIsigners
}

module.exports = {
    getEthObj,
    getOwnerTokens,
    getTokensURI,
    signURIs,
    recoverURISigner
};
