pragma solidity ^0.4.11; 

interface Token { 
    function getTokensOwnedBy(address _owner) external view returns (uint256[]);
    function tokenURI(uint256 _tokenId) public view returns (string); 
}

interface Escrow {
  function getPaymentDetails(uint256 _orderId) external view returns (address producer, address supplier, uint value);
}
