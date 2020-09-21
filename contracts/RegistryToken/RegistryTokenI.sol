pragma solidity 0.6.2;

/**
* @title Registry Token Interface
* @notice Implements an ERC20 staking token that is connected to a registry.
*/

interface RegistryTokenI {
    function initialize(address _owner, string calldata _tokenName, string calldata _tokenSymbol, uint256 _tokenSupply, uint256 _stakePrice) external;
    function addStaker(address _staker) external returns(bool);
    function removeStaker(address _staker) external;
    function isStaker(address _address) external view returns(bool, uint256);
    function setStakePrice(uint256 _newStakePrice) external returns (uint256);
    function depositStake() external payable;
    function withdrawStake() external payable;
    function getBalance() external view returns (uint256);
    function getBalanceAddress(address _address) external view returns (uint256);
    function getAddress() external view returns(address payable);
    fallback() external payable;
    receive() external payable;
}