pragma solidity 0.6.2;

/**
 * @title RegistryController
 * @dev Create and interact with ZNS.
*/

import './RegistryControllerI.sol';
import '../Registry/Registry.sol';
import '../RegistryToken/RegistryToken.sol';
import "../../node_modules/@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

contract RegistryController is RegistryControllerI, Initializable {
    using SafeMath for uint256;

    Registry registry;
    address public registryAddress;

    RegistryToken registryToken;
    address payable public registryTokenAddress;

    uint256 public stakePrice;

    /// @notice Emitted when the RegistryController is initialized.
    event registryControllerInitialized(Registry registry, RegistryToken registryToken);

    /// @notice Emitted when a new Registry is created.
    event createdRegistry(address registrtyAddress, Registry registryToken);

    /// @notice Emitted when a Registry's stake price is updated.
    event stakePriceSet(uint256 newStakePrice);

    /// @notice Emitted when a new entry is created in a Registry.
    event createdRegistryEntry(string subdomain, string ref);

    /// @notice Emitted when a new a Registry 'ref' is updated.
    event registryRefUpdated(string newRef);

    /// @notice Emitted when a new a Registry Entry 'ref' is updated.
    event registryEntryRefUpdated(string subdomain, string newRef);

    /**
     * @notice Initializes a new RegistryController after construction.
     * @param _registry The Registry address that the RegistryConroller will manage.
     * @param _registryToken The RegistryToken address that the RegistryController will manage.
     */

    function initialize(Registry _registry, RegistryToken _registryToken)
        external
        override
        initializer
    {
        registryAddress = payable(address(_registry));
        registry = _registry;
        registryTokenAddress = payable(address(_registryToken));
        registryToken = _registryToken;

        emit registryControllerInitialized(_registry, _registryToken);
    }

    /**
     * @notice Sets a new stake price for a Registry's RegistryToken.
     * @param _newStakePrice The new stake price to be used by the registry.
     */

    function setStakePrice(uint256 _newStakePrice)
        external
        override
    {
        registryToken.setStakePrice(_newStakePrice);
        stakePrice = registryToken.stakePrice();

        emit stakePriceSet(_newStakePrice);
    }

    /**
     * @notice Creates a new entry within a Registry.
     * @param _subdomain The subdomain that will be utilized to reference the current Registry entry.
     * @param _ref The user-defined reference (such as an index or url) that the Registry entry will point to.
     */

    function createRegistryEntry(
        string calldata _subdomain,
        string calldata _ref)
        external
        override
    {
        registry.createRegistryEntry(_subdomain, _ref);
        (bool isRegistered, ) = registry.isRegistered(_subdomain);
        assert(isRegistered==true);

        string memory currentRegistrySubdomain = _subdomain;
        string memory currentRegistryRef = registry.getRegistryEntryRef(_subdomain);
        
        emit createdRegistryEntry(currentRegistrySubdomain, currentRegistryRef);
    }

    /**
     * @notice Updates a Registry's referece value.
     * @param _newRef The new reference value to be updated to.
     */

    function setRef(
        string calldata _newRef)
        external
        override
    {
        registry.setRegistryRef(_newRef);        
        string memory currentRegistryRef = registry.getRef();

        emit registryRefUpdated(currentRegistryRef);
    }

    /**
     * @notice Updates a Registry entries reference value.
     * @param _subdomain The subdomain of the Registry entry to be updated.
     * @param _newRef The new reference value to be updated in the Registry entry.
     */

    function setRegistryEntryRef(
        string calldata _subdomain,
        string calldata _newRef)
        external
        override
    {
        registry.setRegistryEntryRef(_subdomain, _newRef);
        string memory currentRegistryEntryRef = registry.getRegistryEntryRef(_subdomain);

        emit registryEntryRefUpdated(_subdomain, currentRegistryEntryRef);
    }
    
    function getRef() override external returns (string memory) {
        return registry.getRef();
    }

    function getStakePrice() override external returns (uint256) {
        return registryToken.stakePrice();
    }

    function getRegistryEntryRef(string calldata _subdomain) override external returns (string memory) {
        return registry.getRegistryEntryRef(_subdomain);
    }
}