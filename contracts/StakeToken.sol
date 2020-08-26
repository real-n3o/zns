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

    address payable self = payable(address(this));
    uint256 public balance = self.balance;
    uint256 stakePrice = 1250;
    
    event Received(address, uint);
  
    constructor(address _owner, uint256 _supply) ERC20("Meow", "M2M") public payable { 
       _mint(_owner, _supply);
    }

    address[] internal stakers;

    function addStaker(address _staker)
        public returns(bool)
    {
        (bool _isStaker, ) = isStaker(_staker);
        if(!_isStaker) stakers.push(_staker);
        return(_isStaker);
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
    returns(bool) {
        require(msg.value == stakePrice);
        self.send(msg.value);
        balance += msg.value;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
        balance += msg.value;
    }

    function getBalance() 
        public 
        view
    returns (uint256) 
    {
        return balance;
    }
}