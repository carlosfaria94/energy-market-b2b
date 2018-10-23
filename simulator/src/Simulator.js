/*jshint esversion: 6 */
const fs = require('fs');
const path = require('path');

const Eth = require('web3-eth');
const solc = require('solc');


const TOKENS_INTERFACE = fs.readFileSync(path.join(__dirname, 'ContractInterface.sol'),{ encoding: 'utf8' });
const TOKEN_CONTRACT = solc.compile(TOKENS_INTERFACE, 1);

const getEthObj = (providerHost) => new Eth(Eth.givenProvider || providerHost);
const getTokenContract = (eth,tokenAddress) => {
    const tokenInterface = JSON.parse(TOKEN_CONTRACT.contracts[':Token'].interface)

    const token = new eth.Contract(tokenInterface, tokenAddress);
    return token
}
const getEscrowContract = (eth,escrowAddress) => {
    const escrowInterface = JSON.parse(TOKEN_CONTRACT.contracts[':Escrow'].interface)

    const escrow = new eth.Contract(escrowInterface, escrowAddress);
    return escrow
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

const simulateProducer = async (eth, tokenAddress, escrowAddress, producerPrivateKey) => {
  const allEscrowTokens = await getOwnerTokens(eth, tokenAddress, escrowAddress);

  const wallet = eth.accounts.wallet.add(producerPrivateKey);
  // const token = getTokenContract(eth,tokenAddress);
  const escrow = getEscrowContract(eth,escrowAddress);
  const escrowPaymentDetails = await Promise.all(allEscrowTokens.map(id => escrow.methods.getPaymentDetails(id).call()));
  const filterProducerTokens = allEscrowTokens.filter((id,idx) => escrowPaymentDetails[idx].producer === wallet.address);

  const tokenURIs = await getTokensURI(eth, tokenAddress, filterProducerTokens);
  const signedTokenURIs = await signURIs(eth, producerPrivateKey, tokenURIs);
  return { tokenURIs, signedTokenURIs };

  // TODO: SIMULATE PROUDUCER SIGNING THEIR TOKENS
  // FILTER PRODUCER.ADDRESS PAYMENTS TOKEN IDS
  // SIGN URIs
}

// TODO SIMULATE SUPPLIERS RELEASING SECRETS?!?

module.exports = {
    getEthObj,
    getOwnerTokens,
    getTokensURI,
    signURIs,
    recoverURISigner,
  simulateProducer
};
