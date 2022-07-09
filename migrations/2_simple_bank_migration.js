const Migrations = artifacts.require("SimpleBank");
module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
