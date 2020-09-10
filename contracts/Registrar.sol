pragma solidity ^0.6.0;

/**
 * @title Registrar
 * @dev Create and interact with Registries
*/

import './Registry.sol';
import './RegistryToken.sol';
import './Controller.sol';

contract Registrar { 

    event registryAdded(address registry, string _domain, string registryType);

    struct RegistrarEntry {
        address registry;
        string domain;
        string registryType;
    }

    RegistryToken registryToken;
    Registry registry;

    mapping (string => RegistrarEntry) registryMap;
    address[] public registrar;

    function createRegistry (
        string memory _domain,
        string memory _ref,
        string memory _registryType,
        uint256 _stakePrice,
        address payable _registryToken)
        public
    {
        registry = new Registry();

        registry.init(_domain, _ref, _registryType, _registryToken);
        registryToken = RegistryToken(_registryToken);
        registryToken.setStakePrice(_stakePrice);

        Controller controller = new Controller();
        controller.init(address(registry), payable(address(registryToken)));

        registryMap[_domain].registry = registry.getAddress();
        registryMap[_domain].domain = _domain;
        registryMap[_domain].registryType = _registryType;

        registrar.push(registryMap[_domain].registry);

        emit registryAdded(registryMap[_domain].registry, _domain, _registryType);
    }

    function getRegistrarLength() public view returns (uint256) {
        return registrar.length;
    }

    function getRegistryAddress(string memory _domain) public view returns (address) {
        return registryMap[_domain].registry;
    }

    function getRegistryType(string memory _domain) public view returns (string memory) {
        return registryMap[_domain].registryType;
    }
}  