const EnergyToken = artifacts.require('EnergyToken');
const EnergyEscrow = artifacts.require('EnergyEscrow');
const Market = artifacts.require('Market');

module.exports = async deployer => {
  deployer.deploy(Market);
  await deployer.deploy(EnergyToken, 'Renewable Energy Certificate', 'REC');
  await deployer.deploy(EnergyEscrow, EnergyToken.address); // escrow needs token address to be launched
};
