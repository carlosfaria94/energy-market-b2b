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


  it('simulate producer signature on escrow token URIs',async () => {
    const host = web3.currentProvider.host;
    const token = await EnergyToken.deployed();
    const escrow = await EnergyEscrow.deployed();

    let txParam = { from: creator.address };

    const energyProducers = [producer.address, accounts[6], accounts[7]];
    const totalMintedTokens = 5 * energyProducers.length

    // mint tokens
    const mintPromises = [];
    for (let i = 0; i < totalMintedTokens; i++) {
      mintPromises.push(token.mint(energyProducers[i % energyProducers.length], 'description'+i, txParam));
    }
    await Promise.all(mintPromises);

    // get tokenids by user addresses
    const tokensIds = await energyProducers
          .reduce(async (prev,addr) => (await prev).concat(await token.getTokensOwnedBy.call(addr)), [])

    // this code is so unecessarily complicated that I am crying... what was wrong with me!
    // approve other owners for the tokens (in this case escrow)
    // TODO: should be possible run approve by the creator of the token
    const approveTxPromises =  tokensIds
          .map(async tId =>  token.approve(escrow.address, tId, { from: await token.ownerOf.call(tId) }))
    const approveTx = await Promise.all(approveTxPromises)

    // create payment on escrow
    const depositValue = 10;
    txParam = { from: supplier.address, value: depositValue }
    const paymentTxPromises = tokensIds
          .map(tId => escrow.createPayment(tId, supplier.address,{ from: supplier.address, value: depositValue }))
    const paymentTx = await Promise.all(paymentTxPromises);

    const eth = Simulator.getEthObj(host)
    const signedURIs = await Simulator.simulateProducer(eth, token.address, escrow.address, producerPrivateKey);

    const expectedTotalTokes = totalMintedTokens / energyProducers.length;
    assert.equal(expectedTotalTokes, signedURIs.signedTokenURIs.length);
    const signers = Simulator.recoverURISigner(eth,signedURIs.tokenURIs,signedURIs.signedTokenURIs)
    signers.forEach(s => s === producer.address);
  })
});
