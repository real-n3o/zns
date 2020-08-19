const Migrations = artifacts.require("Migrations");
const Registrar = artifacts.require("Registrar");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Registrar);
};
