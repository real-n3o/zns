const Migrations = artifacts.require('Migrations');
const Registrar = artifacts.require('Registrar');
const Controller = artifacts.require('Controller');
const RegistryToken = artifacts.require('RegistryToken');

let owner = '0x1770579e56dab8823cb7b4f16b664c71c34cee5e';
let tokenName = "RegistryToken";
let tokenSymbol = "RTT";
let tokenSupply = 100;
let stakePrice = 250;

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Registrar);
  deployer.deploy(Controller);
  deployer.deploy(RegistryToken, owner, tokenName, tokenSymbol, tokenSupply, stakePrice);
};