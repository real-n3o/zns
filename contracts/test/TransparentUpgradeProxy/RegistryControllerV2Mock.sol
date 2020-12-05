pragma solidity 0.6.2;

/**
 * @title RegistryControllerV2Mock
 * @dev Create and interact with ZNS.
*/

import '../../Registry/Registry.sol';
import '../../RegistryController/RegistryControllerI.sol';
import '../../RegistryToken/RegistryToken.sol';
import "../../../node_modules/@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "../../../node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../../../node_modules/@openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol";

contract RegistryControllerV2Mock is RegistryControllerI, Initializable, OwnableUpgradeable {
    using SafeMathUpgradeable for uint256;

    Registry private registryFactory;

    Registry private registryProxy;
    address public registryProxyAddress;

    RegistryToken private registryToken;
    address payable public registryTokenAddress;

    uint256 public stakePrice;

    string public newUpgradeVar;

    /// @notice Emitted when the RegistryController is initialized.
    event RegistryControllerInitialized(address _registryProxy, RegistryToken _registryTokenProxy);

    /// @notice Emitted when a new Registry is created.
    event CreatedRegistry(address _registryAddress, RegistryToken _registryToken);

    /// @notice Emitted when a Registry's stake price is updated.
    event StakePriceSet(uint256 _newStakePrice);

    /// @notice Emitted when a new entry is created in a Registry.
    event CreatedRegistryEntry(string _subdomain, string _ref);

    /// @notice Emitted when a new a Registry 'ref' is updated.
    event RegistryRefSet(string _newRef);

    /// @notice Emitted when a new a Registry Entry 'ref' is updated.
    event RegistryEntryRefSet(string _subdomain, string _newRef);

    /// @notice Emitted when newUpgradeVar is set.
    event NewUpgradeVarSet(string _newUpgradeVar);

    /**
     * @notice Initializes a new RegistryController after construction.
     * @param _registryProxy The Registry address that the RegistryConroller will manage.
     * @param _registryTokenProxy The RegistryToken address that the RegistryController will manage.
     */

    function initialize(address _registryProxy, RegistryToken _registryTokenProxy, address _owner)
        external
        override
        initializer
    {
        __Ownable_init();
        transferOwnership(_owner);
        registryProxyAddress = _registryProxy;
        registryProxy = Registry(registryProxyAddress);
        
        registryTokenAddress = payable(address(_registryTokenProxy));
        registryToken = _registryTokenProxy;

        emit RegistryControllerInitialized(_registryProxy, _registryTokenProxy);
    }

    /**
     * @notice Sets a new stake price for a Registry's RegistryToken.
     * @param _newStakePrice The new stake price to be used by the registry.
     */

    function setStakePrice(uint256 _newStakePrice)
        external
        override
        onlyOwner
    {
        registryToken.setStakePrice(_newStakePrice);
        stakePrice = registryToken.stakePrice();

        emit StakePriceSet(_newStakePrice);
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
        onlyOwner
    {
        registryProxy.createRegistryEntry(_subdomain, _ref);
        (bool isRegistered, ) = registryProxy.isRegistered(_subdomain);
        assert(isRegistered==true);

        string memory currentRegistrySubdomain = _subdomain;
        string memory currentRegistryRef = registryProxy.getRegistryEntryRef(_subdomain);
        
        emit CreatedRegistryEntry(currentRegistrySubdomain, currentRegistryRef);
    }

    /**
     * @notice Updates a Registry's referece value.
     * @param _newRef The new reference value to be updated to.
     */

    function setRef(
        string calldata _newRef)
        external
        override
        onlyOwner
    {
        registryProxy.setRegistryRef(_newRef);        
        string memory currentRegistryRef = registryProxy.getRef();

        emit RegistryRefSet(currentRegistryRef);
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
        onlyOwner
    {
        registryProxy.setRegistryEntryRef(_subdomain, _newRef);
        string memory currentRegistryEntryRef = registryProxy.getRegistryEntryRef(_subdomain);

        emit RegistryEntryRefSet(_subdomain, currentRegistryEntryRef);
    }
    
    function getRef() override external returns (string memory) {
        return registryProxy.getRef();
    }

    function getStakePrice() override external returns (uint256) {
        return registryToken.stakePrice();
    }

    function getRegistryEntryRef(string calldata _subdomain) override external returns (string memory) {
        return registryProxy.getRegistryEntryRef(_subdomain);
    }

    function setNewUpgradeVar(string memory _newUpgradeVar) public {
        newUpgradeVar = _newUpgradeVar;
        emit NewUpgradeVarSet(_newUpgradeVar);
    }

    function getNewUpgradeVar() public view returns (string memory) {
        return newUpgradeVar;
    }
}