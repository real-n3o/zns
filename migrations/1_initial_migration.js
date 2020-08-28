const Migrations = artifacts.require('Migrations');
const Registrar = artifacts.require('Registrar');
const Controller = artifacts.require('Controller');

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Registrar);
  deployer.deploy(Controller);
};