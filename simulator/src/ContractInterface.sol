pragma solidity ^0.4.11; 

interface Token { 
    function getTokensOwnedBy(address _owner) external view returns (uint256[]);
    function tokenURI(uint256 _tokenId) public view returns (string); 
}

