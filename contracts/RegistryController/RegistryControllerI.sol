pragma solidity ^0.6.0;

/**
 * @title RegistryControllerInterface
 * @dev An Interface for RegistryController.
*/

interface RegistryControllerI {
    function init(address _registry, address payable _registryToken) external;
    function setStakePrice(uint256 _newStakePrice) external;
    function createRegistryEntry(string calldata _subdomain, string calldata _ref) external;
    function setRegistryRef(string calldata _newRef) external;   
    function setRegistryEntryRef(string calldata _subdomain, string calldata _newRef) external;
    function getRef() external returns (string memory);
    function getStakePrice() external returns (uint256);
    function getRegistryEntryRef() external returns (string memory);
}