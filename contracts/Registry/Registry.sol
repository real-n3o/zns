pragma solidity 0.6.2;

/**
 * @title Registry
 * @dev Manages a Registry and it's entries.
*/

import '../RegistryToken/RegistryToken.sol';
import '../Registry/Registry.sol';
import "../../node_modules/@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

contract Registry is Initializable {
    using SafeMath for uint256;

    string domain;
    string ref;
    string registryType;
    RegistryToken registryToken;
    address payable public registryTokenAddress;

    struct RegistryEntry {
        string ref;
        bool isHuman;
    }

    mapping(string => RegistryEntry) registryEntryMap;
    string[] registryEntries;

    /// @notice Emitted when a new Registry is created.
    event RegistryEntryCreated(string subdomain, string ref);

    /// @notice Emitted when the Registry ref is set.
    event RegistryRefSet(string ref);

    /// @notice Emitted when the Registry entry ref is set.
    event RegistryEntryRefSet(string ref);

    /**
     * @notice Initializes a new Registry after construction.
     * @param _domain The primary name used to represent the Registry. 
     * @param _ref The primary reference that a Registry links to. This can be any type of content and is typically used to reference an index or url.
     * @param _registryType The Registry's Type. Registry Types are defined globally at the Registrar and used to categorize Registries.
     * @param _registryToken The address of the Registry's Token. Registry Tokens are issued upon staking Infinity Token to transfer the ownership of a Registry Entry.
     */

    function initialize(
        string memory _domain,
        string memory _ref, 
        string memory _registryType, 
        RegistryToken _registryToken)
        public 
        initializer
    returns (string memory, string memory) 
    {
        domain = _domain;
        ref = _ref;
        registryType = _registryType;
        registryToken = _registryToken;
    }

    // Add staking checks/logic here

    /**
     * @notice Creates a new entry in the Registry.
     * @param _subdomain The subdomain to index the Registry.
     * @param _ref The reference the Registry entry will point to.
     */

    function createRegistryEntry (
        string memory _subdomain, 
        string memory _ref)
        public
    {
        (bool _isRegistered, ) = isRegistered(_subdomain);
        if(!_isRegistered) {
            registryEntryMap[_subdomain].ref = _ref;
            registryEntryMap[_subdomain].isHuman = false;
            registryEntries.push(_subdomain);

            emit RegistryEntryCreated(_subdomain, _ref);
        }
    }

    /**
     * @notice Sets the reference for the Registry.
     * @param _newRef The new reference used for the Registry.
     */

    function setRegistryRef (string memory _newRef) public {
        ref = _newRef;
        emit RegistryRefSet(ref);
    }

    /**
     * @notice Sets the subdomain for a Registry entry.
     * @param _subdomain The subdomain to index the Registry entry.
     */


    function setRegistryEntryRef (string memory _subdomain, string memory _newRef) public {
        registryEntryMap[_subdomain].ref = _newRef;
        emit RegistryEntryRefSet(registryEntryMap[_subdomain].ref);
    }

    /**
     * @notice Returns the domain, reference, type and RegistryToken address for a Registry. 
     */

    function getRegistry() 
        public
        view
    returns(string memory, string memory, string memory, address)
    {
        return(domain, ref, registryType, registryTokenAddress);
    }

    /**
     * @notice Returns the reference of a Registry.
     */

    function getRef()
        public
        view
    returns (string memory)
    {
        return ref;
    }

    /**
     * @notice Returns the Reference for an entry in the Registry.
     * @param _subdomain The subdomain to index the Registry entry.
     */

    function getRegistryEntryRef (string memory _subdomain) 
        public 
        view 
    returns (string memory) {
        return registryEntryMap[_subdomain].ref;
    }

    /**s
     * @notice Returns a boolean representing whether a subdomain is registered within the Registry.
     * @param _subdomain The subdomain to index the Registry entry.
     */

    function isRegistered(string memory _subdomain)
       public
       view
    returns(bool, uint256)
    {
        for (uint256 i = 0; i < registryEntries.length; i += 1){
            if (keccak256(bytes(_subdomain)) == keccak256(bytes(registryEntries[i]))) return (true, i);
        }
        return (false, 0);
    }
}