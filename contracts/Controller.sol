pragma solidity >=0.4.22 <0.7.0;

/**
 * @title Controller
 * @dev Create and interact with ZNS via the ZNS Controller
*/

import './Registry.sol';
import './StakeToken.sol';

contract Controller {

    address controller = address(this);
    address public registryAddress;
    address payable public stakeTokenAddress;
    uint256 public stakePrice;

    /// @notice Emitted when a new registry is created
    event createdRegistry(address _registrtyAddress, address stakeTokenAddress);

    /// @notice Emitted when a registry's stake price is updated
    event stakePriceSet(address _registryAddress, uint256 _newStakePrice);

    /// @notice Emitted when a new entry is created in a specific a registry
    event createdRegistryEntry(address _registryAddress, string subdomain, string ref);

    /**
     * @notice Creates a new Registry within the Registrar
     * @param _domain The registry's unique name and root location in ZNS
     * @param _ref The reference or pointer (such as a url) to a particular domain
     * @param _registryType A valid type associated with the registry 
     * @param _tokenName The token name associated with registry's staking token
     * @param _tokenSymbol The stake token symbol (such as 'IOI')
     * @param _tokenSupply The stake token's initial supply at creation
     * @param _stakePrice The stake price required denominated in ETH to create a new entry in the registry
     */

    function createRegistry(
        string memory _domain,
        string memory _ref,
        string memory _registryType,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenSupply,
        uint256 _stakePrice)
        public 
    {
        StakeToken stakeToken = new StakeToken(controller, _tokenName, _tokenSymbol, _tokenSupply, _stakePrice);
        Registry registry = new Registry();
        registry.init(_domain, _ref, _registryType, stakeToken.getAddress());
        registryAddress = registry.getAddress();
        stakeTokenAddress = registry.stakeTokenAddress();

        emit createdRegistry(registryAddress, stakeTokenAddress);
    }

    /**
     * @notice Sets a new stake price for a registries stake token
     * @param _registryAddress The registries address to update
     * @param _newStakePrice The new stake price to be used by the registry
     */

    function setStakePrice(address _registryAddress, uint256 _newStakePrice)
        public
    {
        Registry registry = Registry(_registryAddress);
        registryAddress = registry.getAddress();
        stakeTokenAddress = registry.stakeTokenAddress();
        StakeToken stakeToken = StakeToken(stakeTokenAddress);
        stakeToken.setStakePrice(_newStakePrice);
        stakePrice = stakeToken.stakePrice();

        emit stakePriceSet(_registryAddress, _newStakePrice);
    }

    /**
     * @notice Creates a new registry entry within a specific registry
     * @param _registryAddress The registries address where the entry will be added
     * @param _subdomain The subdomain that will be created within the registry entry
     * @param _ref The user-defined reference (such as a domain) that the subdomain will point to
     */

    function createRegistryEntry(
        address _registryAddress,
        string memory _subdomain,
        string memory _ref)
        public
    {
        Registry registry = Registry(_registryAddress);
        registry.createRegistryEntry(_subdomain, _ref);
        address currentRegistryAddress = registry.getAddress();
        (bool isRegistered, ) = registry.isRegistered(_subdomain);
        assert(isRegistered==true);
        string memory currentRegistrySubdomain = _subdomain;
        string memory currentRegistryRef = registry.getRegistryEntryRef(_subdomain);
        
        emit createdRegistryEntry(currentRegistryAddress, currentRegistrySubdomain, currentRegistryRef);
    }

    // Update registry ref
    // Update registry entry ref

    // get Registry
    // get RegistryEntry

    // remove RegistryEntry

    // create registryType
    // get registryType
    // remove registryType (only if not in use)
    
    // set max number of registry entries
}