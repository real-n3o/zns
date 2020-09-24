pragma solidity 0.6.2;

/**
 * @title ProxyAdmin
 * @dev Manages the Upgrade Process for ZNS Contracts
*/

import "../../node_modules/@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "../../node_modules/@openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol";

contract ProxyAdmin is Initializable, OwnableUpgradeSafe {

    event Initialized(address _owner);

    function initialize(address _owner) external initializer {
        __Ownable_init();
        if(_owner != msg.sender) transferOwnership(_owner);
        transferOwnership(_owner);
        emit Initialized(this.owner());
    }

    function getTransparentProxyAdmin(address payable _transparentProxyAddress) external onlyOwner returns (address) {
        TransparentUpgradeableProxy transparentProxy;
        transparentProxy = TransparentUpgradeableProxy(_transparentProxyAddress);
        return transparentProxy.admin();
    }

    function getProxyImplementation(address payable _transparentProxyAddress) external onlyOwner returns (address) {
        TransparentUpgradeableProxy transparentProxy;
        transparentProxy = TransparentUpgradeableProxy(_transparentProxyAddress);
        return transparentProxy.implementation();
    }

    function upgradeTransparentProxy(address payable _transparentProxyAddress, address payable _transparentProxyUpgradeAddress) external onlyOwner {
        TransparentUpgradeableProxy transparentProxy;
        transparentProxy = TransparentUpgradeableProxy(_transparentProxyAddress);
        transparentProxy.upgradeTo(_transparentProxyUpgradeAddress);
    }
}

