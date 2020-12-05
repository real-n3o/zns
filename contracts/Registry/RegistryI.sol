pragma solidity 0.6.2;

/**
 * @title Registry Interface
 * @dev Manages a Registry and it's entries.
*/

import '../RegistryToken/RegistryToken.sol';
import '../Registry/Registry.sol';
import "../../node_modules/@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";

interface RegistryI {
    function initialize(string calldata _domain, string calldata _ref, string calldata _registryType, address _registryToken) external;
    function createRegistryEntry (string calldata _subdomain, string calldata _ref) external;
    function setRegistryRef (string calldata _newRef) external;
    function setRegistryEntryRef (string calldata _subdomain, string calldata _newRef) external;
    function getRegistry() external view returns(string memory, string memory, string memory, address);
    function getRef() external view returns (string memory);
    function getRegistryEntryRef (string calldata _subdomain) external view returns (string memory);
    function isRegistered(string calldata _subdomain) external view returns(bool, uint256);
}