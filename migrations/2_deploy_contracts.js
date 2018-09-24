const EnergyToken = artifacts.require('EnergyToken');
const EnergyEscrow = artifacts.require('EnergyEscrow');
const Market = artifacts.require('Market');

module.exports = async deployer => {
  deployer.deploy(Market);
    deployer.deploy(EnergyToken, 'Renewable Energy Certificate', 'REC')
        .then(async () => await deployer.deploy(EnergyEscrow, EnergyToken.address)); // escrow needs token address to be launched
};
