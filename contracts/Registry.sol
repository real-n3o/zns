pragma solidity ^0.6.0;

/**
 * @title Registry
 * @dev Manage individual Registry Entries
*/

contract Registry {
    string domain;
    string registryType;
    address stakeTokenAddress;
    uint256 stakePrice;

    function init(string memory _domain, string memory _registryType, address _stakeTokenAddress) 
    public returns (string memory, string memory) 
    {
        domain = _domain;
        registryType = _registryType;
        stakeTokenAddress = _stakeTokenAddress;
        return (domain, registryType); // necessary?
    }

    function setStakePrice(uint256 _stakePrice) 
    public returns(uint256) 
    {
        stakePrice = _stakePrice;
        return stakePrice;
    } 

    function getAddress() 
    public view returns (address) 
    {  
       address contractAddress = address(this);
       return contractAddress;
    }
}