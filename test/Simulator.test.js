const Simulator = require('../simulator/src/Simulator.js');
const Web3Utils = require('web3-utils'); // need a more recent version of web3 for the signaatures
const Web3Eth = require('web3-eth'); // need a more recent version of web3 for the signaatures

const EnergyToken = artifacts.require('EnergyToken');
const EnergyEscrow = artifacts.require('EnergyEscrow');

contract('Simulator', accounts => {
    // ganache mnemonic
    //   firm laugh oppose example joy soda book syrup gate laundry disagree right
    const creatorPrivateKey = '0x1546e1a27353b3ab3dce3d94faf150cd1f5b86c25c04ae8191d13ec7a844e479'
    const producerPrivateKey = '0xc35fd6f2aace6e3e62f02844c846fe5a4837b8230d53ca3d417af64cb7c20457'
    const supplierPrivateKey = '0x169187e44a8231cfd22b25e393b542fecb93b03dead9806540aab5dcb6959b73'

    const web3Eth = new Web3Eth(web3.currentProvider);
    const creator = web3Eth.accounts.wallet.add(creatorPrivateKey); // web3Eth.accounts.privateKeyToAccount(creatorPrivateKey);
    const producer = web3Eth.accounts.wallet.add(producerPrivateKey); // web3Eth.accounts.privateKeyToAccount(producerPrivateKey)
    const supplier = web3Eth.accounts.wallet.add(supplierPrivateKey); // web3Eth.accounts.privateKeyToAccount(supplierPrivateKey)

    it('get tokens', async () => {
        const host = web3.currentProvider.host;
        const token = await EnergyToken.deployed();
        const escrow = await EnergyEscrow.deployed();

        // mint some dummy tokens
        await token.mint(escrow.address, 'descriptionA');
        await token.mint(escrow.address, 'descriptionB');


        const eth = Simulator.getEthObj(host)
        const tokenIds  = await Simulator.getOwnerTokens(eth,token.address,EnergyEscrow.address);
        assert.equal(tokenIds.length,2)
    });

    it('get tokens URIs', async () => {
        const host = web3.currentProvider.host;
        const token = await EnergyToken.deployed();
        const escrow = await EnergyEscrow.deployed();

        // mint some dummy tokens
        await token.mint(escrow.address, 'descriptionC');
        await token.mint(escrow.address, 'descriptionD');


        const eth = Simulator.getEthObj(host)
        const tokenIds  = await Simulator.getOwnerTokens(eth,token.address,EnergyEscrow.address);
        const tokenURIs  = await Simulator.getTokensURI(eth,token.address,tokenIds);
        assert.equal(tokenURIs.length,4)
    });

    it('sign URIS',async () => {
        const host = web3.currentProvider.host;
        const token = await EnergyToken.deployed();
        const escrow = await EnergyEscrow.deployed();

        // mint some dummy tokens
        await token.mint(escrow.address, 'descriptionE');
        await token.mint(escrow.address, 'descriptionF');


        const eth = Simulator.getEthObj(host)
        const tokenIds  = await Simulator.getOwnerTokens(eth,token.address,EnergyEscrow.address);
        const tokenURIs  = await Simulator.getTokensURI(eth,token.address,tokenIds);
        const signedTokenURIs = Simulator.signURIs(eth,creatorPrivateKey,tokenURIs);
        // don't know other goodd tests to make
        assert.equal(tokenURIs.length,6)

        const signers = Simulator.recoverURISigner(eth,tokenURIs,signedTokenURIs)
        const uniqueSigners = [ ...new Set(signers) ]
        assert.equal(uniqueSigners.length,1)
        assert.equal(uniqueSigners[0].toLowerCase(),creator.address.toLowerCase())
    })
});
