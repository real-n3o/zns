pragma solidity 0.6.2;

import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";

/**
* @title Staking Token
* @notice Implements an ERC20 staking token that is connected to a registry.
*/

contract RegistryToken is ERC20, Ownable {
    using SafeMath for uint256;

    uint256 public stakePrice;
    address payable wallet = payable(address(this));
    uint256 public balance = wallet.balance;
    mapping (address => uint256) private _balances;
    address[] internal stakers;    

    /// @notice Emitted when a new RegistryToken is created.
    event RegistryTokenCreated(address _owner, string _tokenName, string tokenSymbol, uint256 tokenSupply, uint256 stakePrice);

    /// @notice Emitted when tokens are received by RegistryToken.
    event Received(address _stake, uint256 _amount);

    /// @notice Emitted when a new staker is added to RegistryToken.
    event StakerAdded(address _staker);

    /// @notice Emitted when a new staker is removed to RegistryToken.
    event StakerRemoved(address _staker);

    /// @notice Emitted when a new stake price is set.
    event StakePriceSet(uint256 _newStakePrice);

    /// @notice Emitted when new tokens are staked and minted to `msg.sender`.
    event StakeDeposited(address _sender, uint256 _amount, uint256 _senderBalance);

    /// @notice Emitted when new tokens are returned and burned to `msg.sender`.
    event StakeReturned(address _sender, uint256 _amount, uint256 _senderBalance);

    /**
     * @notice Constructs a new RegistryToken.
     * @param _owner The address that will own and control the RegistryToken contract.
     * @param _tokenName The token name for the RegistryToken.
     * @param _tokenSymbol The RegistryToken's symbol (e.g. 'INI').
     * @param _tokenSupply The initial total supply for the RegistryToken.
     * @param _stakePrice The initial amount/price to add an Entry to the Registry, denominated in Infinity Token.
     */

    constructor(
        address _owner, 
        string memory _tokenName, 
        string memory _tokenSymbol, 
        uint256 _tokenSupply,
        uint256 _stakePrice) 
    ERC20(_tokenName, _tokenSymbol) 
        public
        payable
    { 
        _mint(_owner, _tokenSupply);
        stakePrice = _stakePrice;
        emit RegistryTokenCreated(_owner, _tokenName, _tokenSymbol, _tokenSupply, _stakePrice);
    }

    // function initialize() public {

    // }

    /**
     * @notice Adds a new staker to the RegistryToken.
     * @param _staker The address of the staker to be added. 
     * @return boolean on whether or not staker is addedd successfully.
     */

    function addStaker(address _staker)
        public 
    returns(bool)
    {
        (bool _isStaker, ) = isStaker(_staker);
        uint256 stakerBalance = getBalanceAddress(_staker);
        if((!_isStaker) && (stakerBalance==stakePrice)) {
            stakers.push(_staker);
            emit StakerAdded(_staker);
            return(_isStaker);
        }
    }

    /**
     * @notice Removes a staker from the RegistryToken.
     * @param _staker The address of the staker to be removed. 
     */

    function removeStaker(address _staker)
        public
    {
        (bool _isStaker, uint256 s) = isStaker(_staker);
        if(_isStaker){
            stakers[s] = stakers[stakers.length - 1];
            stakers.pop();
            emit StakerRemoved(_staker);
        }
    }

    /**
     * @notice Returns if a staker exists in the Registry and their total number of registry tokens.
     * @param _address The address of the staker.
     * @return boolean representing if staker exists in the Registry and uint256 of total numbers of Registry tokens assigned to `_address`.
     */

    function isStaker(address _address)
       public
       view
    returns(bool, uint256)
    {
        for (uint256 i = 0; i < stakers.length; i += 1){
            if (_address == stakers[i]) return (true, i);
        }
        return (false, 0);
    }

    /**
     * @notice Sets the stake price for a RegistryToken.
     * @param _newStakePrice The new stake price to be used for adding registry entries.
     * @return uint256 representing the new stake price, denominated in Infinity.
     */

    function setStakePrice(uint256 _newStakePrice) public returns (uint256) {
        stakePrice = _newStakePrice;
        emit StakePriceSet(stakePrice);
        return stakePrice;
    }

    /**
     * @notice Mints new registry tokens `msg.sender` upon sending Infinity to RegistryToken equal to `stakePrice`.
     * Requires `msg.sender` sends a valid `msg.value` in the transaction.
     */

    function depositStake()
        public
        payable
    {
        require(msg.value == stakePrice);
        _mint(msg.sender, msg.value);
        balance += msg.value;
        _balances[msg.sender] += msg.value;

        (bool success, ) = msg.sender.call.value(msg.value)("");
        require(success, "Transfer failed.");
        
        emit StakeDeposited(msg.sender, msg.value, _balances[msg.sender]);
    }

    /**
     * @notice Withdraws registry tokens held by `msg.sender`, burns the associated number of registry tokens and returns the current amount of Infinity staked.
     * Requires `msg.sender` sends a valid `msg.value` in the transaction.
     */

    function withdrawStake()
        public
        payable
    {
        require(msg.value == stakePrice);
        address payable sender = msg.sender;
        _burn(sender, stakePrice);
        balance -= stakePrice;
        _balances[sender] -= stakePrice;

        (bool success, ) = msg.sender.call.value(msg.value)("");
        require(success, "Transfer failed.");

        emit StakeReturned(msg.sender, msg.value, _balances[msg.sender]);
    }

    /**
     * @notice Returns the balance of all tokens in the RegistryToken.
     * @return uint256 reprenting the balance 
     */

    function getBalance() 
        public 
        view
    returns (uint256) 
    {
        return balance;
    }

    /**
     * @notice Returns the balance of tokens for a particular address.
     * @param _address The total number of registry tokens held by an address.
     * @return uint256 reprenting the address balance 
     */

    function getBalanceAddress(address _address)
        public
        view
    returns (uint256)
    {
        return _balances[_address];
    }

     /**
     * @notice Returns a `payable` address of the RegistryToken.
     */

    function getAddress()
        public
        view
    returns(address payable)
    {
        return payable(address(this));
    }

    /**
     * @notice Method is executed if tokens are transfered to RegistryContract without a proper call.
     */

    fallback() external payable {
        depositStake();
    }

    /**
     * @notice Method is executed when tokens are sent to RegistryContract.
     */

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}