pragma solidity >=0.4.22 <0.7.0;

/**
 * @title Registrar
 * @dev Create and interact with Registries
*/

contract Registrar {

    event registryAdded(address registryContract, string registryName, string registryType);

    struct RegistrarEntry {
        address registryContract;
        string registryName;
        string registryType;
    }

    mapping (string => RegistrarEntry) registryMap;
    RegistrarEntry[] public registrar;

    function createRegistry (
        string memory _registryName,
        string memory _registryType
    ) public returns (address, string memory, string memory) {
        RegistrarEntry storage registry = registryMap[_registryName];
        
        Registry registryContract = new Registry();
        registryContract.init(_registryName, _registryType);

        registry.registryContract = registryContract.getAddress();
        registry.registryName = _registryName;
        registry.registryType = _registryType;

        registrar.push(registry);
        emit registryAdded(registry.registryContract, _registryName, _registryType);

        return (registry.registryContract, registry.registryName, registry.registryType);
    }

    function getRegistries() public view returns (uint256) {
        return registrar.length;
    }
}

contract Registry {
    string registryName;
    string registryType;

    constructor() public {}

    function init(string memory _registryName, string memory _registryType) public {
        registryName = _registryName;
        registryType = _registryType;
    }

    function getAddress() public view returns (address) {  
       address contractAddress = address(this);
       return contractAddress;  
    }  
}