pragma solidity >=0.4.22 <0.7.0;

/**
 * @title Registry
 * @dev Manage individual Registry Entries
*/

contract Registry {
    string registryName;
    string registryType;

    constructor() public {}

    function init(string memory _registryName, string memory _registryType) public {
        registryName = _registryName;
        registryType = _registryType;
    }

    function getAddress() public view returns (address) {  
       address contractAddress = address(this);
       return contractAddress;  
    }  
}