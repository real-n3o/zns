pragma solidity ^0.6.0;

/**
 * @title Registrar
 * @dev Create and interact with Registries
*/

import './Registry.sol';
import './StakeToken.sol';

contract Registrar { 

    event registryAdded(address registryContract, string _domain, string registryType);

    struct RegistrarEntry {
        address registryContract;
        string domain;
        string registryType;
    }

    mapping (string => RegistrarEntry) registryMap;
    address[] public registrar;

    function createRegistry (
        string memory _domain,
        string memory _reference,
        string memory _registryType,
        string memory _tokenName,
        string memory _tokenTicker,
        uint256 _tokenSupply,
        uint256 _stakePrice
    ) public returns (address, string memory, string memory) {
        Registry registryContract = new Registry();
        StakeToken stakeToken = new StakeToken(msg.sender, _tokenName, _tokenTicker, _tokenSupply);
        registryContract.init(_domain, _reference, _registryType, address(stakeToken));
        registryContract.setStakePrice(_stakePrice);

        registryMap[_domain].registryContract = registryContract.getAddress();
        registryMap[_domain].domain = _domain;
        registryMap[_domain].registryType = _registryType;

        registrar.push(registryMap[_domain].registryContract);
        emit registryAdded(registryMap[_domain].registryContract, _domain, _registryType);

        return (registryMap[_domain].registryContract, registryMap[_domain].domain, registryMap[_domain].registryType);
    }

    function getRegistrarLength() public view returns (uint256) {
        return registrar.length;
    }

    function getRegistryAddress(string memory _domain) public view returns (address) {
        return registryMap[_domain].registryContract;
    }

    function getRegistryType(string memory _domain) public view returns (string memory) {
        return registryMap[_domain].registryType;
    }
}  