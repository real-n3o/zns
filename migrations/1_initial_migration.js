const Migrations = artifacts.require("Migrations");
const Registrar = artifacts.require("Registrar");
const StakeToken = artifacts.require("StakeToken");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Registrar);
};