pragma solidity ^0.6.0;

/**
 * @title Registry
 * @dev Manage Registry Entries
*/

import './StakeToken.sol';

contract Registry {
    string domain;
    string ref;
    string registryType;
    address payable public stakeTokenAddress;
    // uint256 public stakePrice;

    address registryAddress = address(this);

    function init(
        string memory _domain,
        string memory _ref, 
        string memory _registryType, 
        address payable _stakeTokenAddress) 
    public 
    returns (string memory, string memory) 
    {
        domain = _domain;
        ref = _ref;
        registryType = _registryType;
        stakeTokenAddress = _stakeTokenAddress;
    }

    // function setStakePrice(uint256 _stakePrice) 
    //     public 
    // returns(uint256) 
    // {
    //     // StakeToken stakeToken = StakeToken.at(stakeTokenAddress);
    //     stakePrice = _stakePrice;
    //     return stakePrice;
    // } 

    function getAddress() 
        public 
        view 
    returns (address) 
    {  
       return registryAddress;
    }

    function getRef()
        public
        view
    returns (string memory)
    {
        return ref;
    }
}