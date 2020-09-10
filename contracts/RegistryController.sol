pragma solidity >=0.4.22 <0.7.0;

/**
 * @title RegistryController
 * @dev Create and interact with ZNS
*/

import './Registry.sol';
import './RegistryToken.sol';

contract RegistryController {

    Registry registry;
    address public registryAddress;

    RegistryToken registryToken;
    address payable public registryTokenAddress;
    uint256 public stakePrice;

    /// @notice Emitted when a new registry is created
    event createdRegistry(address registrtyAddress, address registryTokenAddress);

    /// @notice Emitted when a registry's stake price is updated
    event stakePriceSet(uint256 newStakePrice);

    /// @notice Emitted when a new entry is created in a specific a registry
    event createdRegistryEntry(string subdomain, string ref);

    /// @notice Emitted when a new a registry ref is updated
    event registryRefUpdated(string newRef);

    /// @notice Emitted when a new a registry entry ref is updated
    event registryEntryRefUpdated(string subdomain, string newRef);

    function init(address _registry, address payable _registryToken) 
        public 
    {
        registryAddress = _registry;
        registry = Registry(registryAddress);
        registryTokenAddress = _registryToken;
        registryToken = RegistryToken(registryTokenAddress);
    }

    /**
     * @notice Sets a new stake price for a registries stake token
     * @param _newStakePrice The new stake price to be used by the registry
     */

    function setStakePrice(uint256 _newStakePrice)
        public
    {
        registryToken.setStakePrice(_newStakePrice);
        stakePrice = registryToken.stakePrice();

        emit stakePriceSet(_newStakePrice);
    }

    /**
     * @notice Creates a new registry entry within a specific registry
     * @param _subdomain The subdomain that will be created within the registry entry
     * @param _ref The user-defined reference (such as a domain) that the subdomain will point to
     */

    function createRegistryEntry(
        string memory _subdomain,
        string memory _ref)
        public
    {
        registry.createRegistryEntry(_subdomain, _ref);
        (bool isRegistered, ) = registry.isRegistered(_subdomain);
        assert(isRegistered==true);

        string memory currentRegistrySubdomain = _subdomain;
        string memory currentRegistryRef = registry.getRegistryEntryRef(_subdomain);
        
        emit createdRegistryEntry(currentRegistrySubdomain, currentRegistryRef);
    }

    /**
     * @notice Updates a registry's ref value
     * @param _newRef The new ref value to be updated to
     */

    function setRegistryRef(
        string memory _newRef)
        public
    {
        registry.setRegistryRef(_newRef);        
        string memory currentRegistryRef = registry.getRef();

        emit registryRefUpdated(currentRegistryRef);
    }

    /**
     * @notice Updates a registry entries ref value
     * @param _subdomain The subdomain of the registry entry to be updated
     * @param _newRef The new ref value to be updated in the registry entry
     */

    function setRegistryEntryRef(
        string memory _subdomain,
        string memory _newRef)
        public
    {
        registry.setRegistryEntryRef(_subdomain, _newRef);
        string memory currentRegistryEntryRef = registry.getRegistryEntryRef(_subdomain);

        emit registryEntryRefUpdated(_subdomain, currentRegistryEntryRef);
    }
}