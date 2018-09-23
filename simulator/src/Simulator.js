/*jshint esversion: 6 */
const Eth = require('web3-eth');
const solc = require('solc');

console.log('index file running');

const TOKENS_INTERFACE = 'pragma solidity ^0.4.11;\n' +
'interface Token {\n' +
'function getTokensOwnedBy(address _owner) external view returns (uint256[]);\n' +
'function tokenURI(uint256 _tokenId) public view returns (string);\n' +
'}';

const compile = () => solc.compile(TOKENS_INTERFACE, 1);

const getOwnerTokens = (provider,tokenAddress,escrowAddress) => {
    const eth = new Eth(Eth.givenProvider || provider);

    const contractObj = compile();

    const token = new eth.Contract(contractObj.contracts.Token.interface, tokenAddress);
    console.log(token);
};

const firstFunction = () => console.log('FIRST FUNCTION');

module.exports = {
    firstFunction,
    compile
};
