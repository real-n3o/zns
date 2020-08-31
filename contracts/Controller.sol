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

    event createdRegistry(address _registrtyAddress, address stakeTokenAddress);
    event stakePriceSet(address _registryAddress, uint256 _newStakePrice);
    event createdRegistryEntry(address _registryAddress, string subdomain, string ref);

    function createRegistry(
        string memory _domain,
        string memory _ref,
        string memory _registryType,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenSupply,
        uint256 _stakePrice
    )
        public 
    returns(address)
    {
        StakeToken stakeToken = new StakeToken(controller, _tokenName, _tokenSymbol, _tokenSupply, _stakePrice);
        Registry registry = new Registry();
        registry.init(_domain, _ref, _registryType, stakeToken.getAddress());
        registryAddress = registry.getAddress();
        stakeTokenAddress = registry.stakeTokenAddress();

        emit createdRegistry(registryAddress, stakeTokenAddress);
    }

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

    function createRegistryEntry(
        address _registryAddress,
        string memory _subdomain,
        string memory _ref)
        public
    {
        Registry registry = Registry(_registryAddress);
        registry.createRegistryEntry(_subdomain, _ref);
        address currentRegistryAddress = registry.getAddress();
        (bool isRegistered, uint256 stakeBalance) = registry.isRegistered(_subdomain);
        assert(isRegistered==true);
        if(isRegistered==true) {
            string memory currentRegistrySubdomain = _subdomain;
            string memory currentRegistryRef = registry.getRegistryEntryRef(_subdomain);
            emit createdRegistryEntry(currentRegistryAddress, currentRegistrySubdomain, currentRegistryRef);

        }
    }

    // create RegistryEntry


    // make sure domain is unique
    // update ref

    // get Registry

    // list Registry
    // create RegistryEntry
    // list RegistryEntry
    // remove RegistryEntry
    // create registryType
    // list RegistryTypes
    // remove registryType
}