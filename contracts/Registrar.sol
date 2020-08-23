pragma solidity >=0.4.22 <0.7.0;

/**
 * @title Registrar
 * @dev Create and interact with Registries
*/

contract Registrar {

    event registryAdded(address owner, string registryName, string registryType);

    struct Registry {
        address owner;
        string registryName;
        string registryType;
    }

    mapping (string => Registry) registryMap;
    Registry[] public registrar;

    function createRegistry (
        address _owner, 
        string memory _registryName,
        string memory _registryType
    ) public returns (address, string memory, string memory) {
        Registry storage registry = registryMap[_registryName];

        registry.owner = _owner;
        registry.registryName = _registryName;
        registry.registryType = _registryType;

        registrar.push(registry);
        emit registryAdded(_owner, _registryName, _registryType);

        return (registry.owner, registry.registryName, registry.registryType);
    }

    function getRegistries() public view returns (uint256) {
        return registrar.length;
    }
}
