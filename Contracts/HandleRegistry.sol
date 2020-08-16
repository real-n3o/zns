pragma solidity >=0.4.22 <0.7.0;

/**
 * @title Registry
 * @dev Store & retrieve registered ZNS Handle entries
*/

contract HandleRegistry {

    struct HandleRegistration {
        address owner;
        string handle;
        string zId;
    }

    mapping (string => HandleRegistration) handleMap;
    HandleRegistration[] public handles;

    function registerHandle(address _owner, string memory _handle, string memory _zId) public {
        require(zIdCheck(_zId));
        require(getHandleAvailability(_handle));
        
        HandleRegistration storage registration = handleMap[_handle];
        
        registration.owner = _owner;
        registration.handle = _handle; 
        registration.zId = _zId;
        
        handles.push(registration);
    }
 
    function zIdCheck(string memory _zId) public pure returns (bool) {
        if(stringsEqual(_zId, "0x36BA68c5B715405A373C5C7aBCda625E25F39175")) {
            return true;
        } else {
            return false;
        }
    }
    
    function getHandleAvailability(string memory _handle) public view returns (bool) {
        HandleRegistration memory registration = handleMap[_handle];
        address handleAddress = registration.owner;
        if(handleAddress==address(0)) {
            return true;
        }
    }
    
    function getHandleAddress (string memory _handle) public view returns (address) {
        HandleRegistration memory registration = handleMap[_handle];
        return registration.owner;
    }
    
    function stringsEqual(string memory _a, string memory _b) internal pure returns (bool) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        if(bytes(a).length==bytes(b).length) {
            return true;
        } else {
            return false;
        }
    }
    
}

// >> to_do:

// 0. check if entry already exists
// 1. check if zId is valid
// 2. ? 
// 3. charge xx Infinity in order to enter ... 
