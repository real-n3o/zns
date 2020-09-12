pragma solidity ^0.6.0;

/**
 * @title Registrar
 * @dev Create and interact with Registries.
*/

import './Registry.sol';
import './RegistryToken.sol';
import './RegistryController.sol';

contract Registrar { 

    /// @notice Emitted when a new Registry is added to the Registrar.
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

    /**
     * @notice Creates a new Registry and associated Entry in the Registrar.
     * @param _domain The primary name used to represent a particular Registry. 
     * @param _ref The primary reference that a Registry links to. This can be any type of content and is typically used to reference an index or url.
     * @param _registryType The Registry's Type. Registry Types are defined globally at the Registrar and used to categorize Registries.
     * @param _stakePrice The amount of Infinity Token required to register a new Entry in the Registry. 
     * @param _registryToken The address of the Registry's Token. Registry Tokens are issued upon staking Infinity Token to transfer the ownership of a Registry Entry.
     */

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

        RegistryController controller = new RegistryController();
        controller.init(address(registry), payable(address(registryToken)));

        registryMap[_domain].registry = address(registry);
        registryMap[_domain].domain = _domain;
        registryMap[_domain].registryType = _registryType;

        registrar.push(registryMap[_domain].registry);

        emit registryAdded(registryMap[_domain].registry, _domain, _registryType);
    }

    /**
     * @notice Returns the the number of Registries in the Registrar as an interger. 
     */

    function getRegistrarLength() public view returns (uint256) {
        return registrar.length;
    }

    /**
     * @notice Returns the address of a Registry by providing its domain as a string.
     * @param _domain The primary name used to represent a particular Registry. 
     */

    function getRegistryAddress(string memory _domain) public view returns (address) {
        return registryMap[_domain].registry;
    }

    /**
     * @notice Returns the Type of a Registry by providing its domain as a string.
     * @param _domain The primary name used to represent a particular Registry. 
     */

    function getRegistryType(string memory _domain) public view returns (string memory) {
        return registryMap[_domain].registryType;
    }
}  