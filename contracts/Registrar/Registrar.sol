pragma solidity 0.6.2;

/**
 * @title Registrar
 * @dev Create and interact with Registries.
*/

import '../Registry/Registry.sol';
import '../RegistryToken/RegistryToken.sol';
import '../RegistryController/RegistryController.sol';
import "../../node_modules/@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "../../node_modules/@openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol";

contract Registrar { 
    using SafeMath for uint256;

    struct RegistrarEntry {
        address controller;
        string domain;
        string registryType;
    }

    Registry registryLogic;
    TransparentUpgradeableProxy registryProxy;
    address registryProxyAddress;

    RegistryToken registryTokenProxy;
    address registryTokenProxyAddress;

    RegistryController registryControllerLogic;
    TransparentUpgradeableProxy registryControllerProxy;

    mapping (string => RegistrarEntry) registryMap;
    address[] public registrar;

    /// @notice Emitted when a new Registry is added to the Registrar.
    event RegistryCreated(string domain, string ref, string registryType, uint256 stakePrice, address registryToken, address registry, address registryController);

    /**
     * @notice Creates a new Registry and associated Entry in the Registrar.
     * @param _domain The primary name used to represent a particular Registry. 
     * @param _ref The primary reference that a Registry links to. This can be any type of content and is typically used to reference an index or url.
     * @param _registryType The Registry's Type. Registry Types are defined globally at the Registrar and used to categorize Registries.
     * @param _stakePrice The amount of Infinity Token required to register a new Entry in the Registry. 
     * @param _registryTokenProxyAddress The address of the Registry's Token. Registry Tokens are issued upon staking Infinity Token to transfer the ownership of a Registry Entry.
     */

    function createRegistry (
        string memory _domain,
        string memory _ref,
        string memory _registryType,
        uint256 _stakePrice,
        address payable _registryTokenProxyAddress)
        public
    {
        registryTokenProxyAddress = _registryTokenProxyAddress;
        registryTokenProxy = RegistryToken(_registryTokenProxyAddress);

        registryLogic = new Registry();
        bytes memory registryData = abi.encodeWithSignature("initialize(string,string,string,address)",_domain,_ref,_registryType,registryTokenProxyAddress);
        registryProxy = new TransparentUpgradeableProxy(
            address(registryLogic),
            msg.sender,
            registryData
        );
        registryProxyAddress = address(registryProxy);

        registryControllerLogic = new RegistryController();
        bytes memory controllerData = abi.encodeWithSignature("initialize(address,address)",address(registryProxy), address(registryTokenProxy));
        registryControllerProxy = new TransparentUpgradeableProxy(
            address(registryControllerLogic),
            msg.sender,
            controllerData
        );
        
        // RegistryController registryControllerInstance;
        // registryControllerInstance = RegistryController(address(registryControllerProxy));
        // registryControllerInstance.setStakePrice(_stakePrice);
        
        registryMap[_domain].controller = address(registryControllerProxy);
        registryMap[_domain].domain = _domain;
        registryMap[_domain].registryType = _registryType;

        registrar.push(registryMap[_domain].controller);

        emit RegistryCreated( _domain, _ref, _registryType, _stakePrice, registryTokenProxyAddress, registryProxyAddress, registryMap[_domain].controller);
    }

    /**
     * @notice Returns the the number of Registries in the Registrar as an interger. 
     */

    function getRegistrarLength() public view returns (uint256) {
        return registrar.length;
    }

    /**
     * @notice Returns the address of a Registry Controller by providing its domain as a string.
     * @param _domain The primary name used to represent a particular Registry. 
     */

    function getRegistryController(string memory _domain) public view returns (address) {
        return registryMap[_domain].controller;
    }

    /**
     * @notice Returns the Type of a Registry by providing its domain as a string.
     * @param _domain The primary name used to represent a particular Registry. 
     */

    function getRegistryType(string memory _domain) public view returns (string memory) {
        return registryMap[_domain].registryType;
    }
}