pragma solidity >=0.4.22 <0.7.0;

/**
 * @title Registry
 * @dev Create and interact with Registries
*/

contract Registrar {

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
    ) public {
        Registry storage registry = registryMap[_registryName];

        registry.owner = _owner;
        registry.registryName = _registryName;
        registry.registryType = _registryType;

        registrar.push(registry);
    }

    function getRegistries() public view returns (string memory) {
        string memory registries;
        for(uint256 a=0; a<registrar.length; a++) {
            registries = registrar[a].registryName;
        }

        return registries;
    }
}
