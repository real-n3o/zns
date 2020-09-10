pragma solidity ^0.6.0;

/**
 * @title Registry
 * @dev Manage Registry Entries
*/

import './RegistryToken.sol';
import './Registry.sol';

contract Registry {
    string domain;
    string ref;
    string registryType;
    address payable public registryTokenAddress;

    event RegistryEntryAdded(string subdomain, string ref);

    struct RegistryEntry {
        string ref;
        bool isHuman;
    }

    mapping(string => RegistryEntry) registryEntryMap;
    string[] registryEntries;

    function init(
        string memory _domain,
        string memory _ref, 
        string memory _registryType, 
        address payable _registryToken)
        public 
    returns (string memory, string memory) 
    {
        domain = _domain;
        ref = _ref;
        registryType = _registryType;
        registryTokenAddress = _registryToken;
    }

    function getRegistry() 
        public
        view
    returns(string memory, string memory, string memory, address)
    {
        // uint256 stakePrice = 10;
        return(domain, ref, registryType, registryTokenAddress);
    }

    function getRef()
        public
        view
    returns (string memory)
    {
        return ref;
    }

    // Add staking checks/logic here

    function createRegistryEntry (
        string memory _subdomain, 
        string memory _ref)
        public
    {
        (bool _isRegistered, ) = isRegistered(_subdomain);
        if(!_isRegistered) {
            registryEntryMap[_subdomain].ref = _ref;
            registryEntryMap[_subdomain].isHuman = false;
            registryEntries.push(_subdomain);
            emit RegistryEntryAdded(_subdomain, _ref);
        }
    }

    function getRegistryEntryRef (string memory _subdomain) 
        public 
        view 
    returns (string memory) {
        return registryEntryMap[_subdomain].ref;
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

    function setRegistryRef (string memory _newRef) public {
        ref = _newRef;
    }

    function setRegistryEntryRef (string memory _subdomain, string memory _newRef) public {
        registryEntryMap[_subdomain].ref = _newRef;
    }
}