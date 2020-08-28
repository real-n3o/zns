pragma solidity ^0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";

/**
* @title Staking Token
* @notice Implements an ERC20 staking token.
*/

contract StakeToken is ERC20, Ownable {
    using SafeMath for uint256;

    uint256 stakePrice = 1682160000000001;
    address payable wallet = payable(address(this));
    uint256 public balance = wallet.balance;
    mapping (address => uint256) private _balances;
    address[] internal stakers;    

    event Received(address, uint);
  
    constructor(
        address _owner, 
        string memory _tokenName, 
        string memory _tokenSymbol, 
        uint256 _tokenSupply) 
        ERC20(_tokenName, _tokenSymbol) public payable 
    { 
       _mint(_owner, _tokenSupply);
    }

    function addStaker(address _staker)
        public 
    returns(bool)
    {
        (bool _isStaker, ) = isStaker(_staker);
        uint256 stakerBalance = getBalanceAddress(_staker);
        if((!_isStaker) && (stakerBalance==stakePrice)) {
            stakers.push(_staker);
            return(_isStaker);
        }
    }

    function removeStaker(address _staker)
        public
    {
        (bool _isStaker, uint256 s) = isStaker(_staker);
        if(_isStaker){
            stakers[s] = stakers[stakers.length - 1];
            stakers.pop();
        }
    }

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

    function sendStake()
        public
        payable
    {
        require(msg.value == stakePrice);
        _mint(msg.sender, msg.value);
        balance += msg.value;
        _balances[msg.sender] += msg.value;
        wallet.transfer(msg.value);
    }

    function withdrawStake()
        public
        payable
    {
        // require(msg.value == stakePrice);
        address payable sender = msg.sender;
        _burn(sender, stakePrice);
        balance -= stakePrice;
        _balances[sender] -= stakePrice;
        sender.transfer(stakePrice);
    }

    fallback() external payable {
        sendStake();
    }

    receive() external payable {
        // balance += msg.value;
        emit Received(msg.sender, msg.value);
    }

    function getBalance() 
        public 
        view
    returns (uint256) 
    {
        return balance;
    }

    function getBalanceAddress(address _address)
        public
        view
    returns (uint256)
    {
        return _balances[_address];
    }
}