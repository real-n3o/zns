pragma solidity ^0.6.0;

/**
 * @title Registrar
 * @dev Create and interact with Registries
*/

import './Registry.sol';
import './StakeToken.sol';

contract Registrar { 

    event registryAdded(address registryContract, string registryName, string registryType);

    struct RegistrarEntry {
        address registryContract;
        string registryName;
        string registryType;
    }

    mapping (string => RegistrarEntry) registryMap;
    address[] public registrar;

    function createRegistry (
        string memory _registryName,
        string memory _registryType,
        uint256 _stakePrice
    ) public returns (address, string memory, string memory) {
                
        Registry registryContract = new Registry();
        StakeToken stakeToken = new StakeToken(msg.sender, 250); // change static initial supply to var
        registryContract.init(_registryName, _registryType, address(stakeToken));
        registryContract.setStakePrice(_stakePrice);

        registryMap[_registryName].registryContract = registryContract.getAddress();
        registryMap[_registryName].registryName = _registryName;
        registryMap[_registryName].registryType = _registryType;

        registrar.push(registryMap[_registryName].registryContract);
        emit registryAdded(registryMap[_registryName].registryContract, _registryName, _registryType);

        return (registryMap[_registryName].registryContract, registryMap[_registryName].registryName, registryMap[_registryName].registryType);
    }

    function getRegistrarLength() public view returns (uint256) {
        return registrar.length;
    }

    function getRegistryAddress(string memory _name) public view returns (address) {
        return registryMap[_name].registryContract;
    }

    function getRegistryType(string memory _name) public view returns (string memory) {
        return registryMap[_name].registryType;
    }
}  