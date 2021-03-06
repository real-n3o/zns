const Migrations = artifacts.require('Migrations');
const Registrar = artifacts.require('Registrar');
const RegistryController = artifacts.require('RegistryController');
const RegistryToken = artifacts.require('RegistryToken');
const TransparentUpgradeableProxy = artifacts.require('TransparentUpgradeableProxy.sol');
const ProxyAdmin = artifacts.require('ProxyAdmin.sol');

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Registrar);
  deployer.deploy(RegistryController);
  deployer.deploy(RegistryToken);
  deployer.deploy(ProxyAdmin);
};