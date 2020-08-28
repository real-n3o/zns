pragma solidity >=0.4.22 <0.7.0;

/**
 * @title Controller
 * @dev Create and interact with ZNS via the ZNS Controller
*/

import './Registry.sol';
import './StakeToken.sol';

contract Controller {

    address controller = address(this);

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
    returns(Registry)
    {
        StakeToken stakeToken = new StakeToken(controller, _tokenName, _tokenSymbol, _tokenSupply, _stakePrice);
        Registry registry = new Registry();
        registry.init(_domain, _ref, _registryType, stakeToken.getAddress());
        return registry;
    }

    function setStakePrice(address _registry, uint256 _newStakePrice)
        public
    returns(uint256)
    {
        // _registry.setStakePrice(_newStakePrice);
        // return _registry.stakePrice;
    }

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