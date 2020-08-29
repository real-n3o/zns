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

    event stakePriceSet(address _registryAddress, uint256 _newStakePrice);

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