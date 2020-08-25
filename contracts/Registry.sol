pragma solidity ^0.6.0;

/**
 * @title Registry
 * @dev Manage individual Registry Entries
*/

contract Registry {
    string registryName;
    string registryType;
    uint256 stakePrice;

    function init(string memory _registryName, string memory _registryType) public returns (string memory, string memory) {
        registryName = _registryName;
        registryType = _registryType;
        return (registryName, registryType);
    }

    function setStakePrice(uint256 _stakePrice) public returns(uint256) {
        stakePrice = _stakePrice;
        return stakePrice;
    } 

    function getAddress() public view returns (address) {  
       address contractAddress = address(this);
       return contractAddress;
    }
}