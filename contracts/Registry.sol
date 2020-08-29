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

    address registryAddress = address(this);

    event RegistryEntryAdded(string subdomain, string ref);

    struct RegistryEntry {
        string subdomain;
        string ref;
        bool isHuman;
    }

    mapping(string => RegistryEntry) registryEntryMap;
    string[] registryEntries;

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

    function createRegistryEntry (
        string memory _subdomain, 
        string memory _ref)
        public
    {
        (bool _isRegistered, ) = isRegistered(_subdomain);
        if(!_isRegistered) {
            registryEntries.push(_subdomain);
            emit RegistryEntryAdded(_subdomain, _ref);
        }
    }

    function isRegistered(string memory _subdomain)
       public
       view
    returns(bool, uint256)
    {
        for (uint256 i = 0; i < registryEntries.length; i += 1){
            if (keccak256(bytes(_subdomain)) == keccak256(bytes(registryEntries[i]))) return (true, i);
        }
        return (false, 0);
    }
}