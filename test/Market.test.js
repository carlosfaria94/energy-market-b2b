const Web3Utils = require('web3-utils'); // need a more recent version of web3 for the signaatures
const Web3Eth = require('web3-eth'); // need a more recent version of web3 for the signaatures

const Market = artifacts.require('./Market.sol');
const { expectThrow } = require('./helpers/expectThrow');

contract('Market', accounts => {
  // ganache mnemonic
  //   firm laugh oppose example joy soda book syrup gate laundry disagree right
  const creatorPrivateKey =
    '0x1546e1a27353b3ab3dce3d94faf150cd1f5b86c25c04ae8191d13ec7a844e479';
  const producerPrivateKey =
    '0xc35fd6f2aace6e3e62f02844c846fe5a4837b8230d53ca3d417af64cb7c20457';
  const supplierPrivateKey =
    '0x169187e44a8231cfd22b25e393b542fecb93b03dead9806540aab5dcb6959b73';

  const web3Eth = new Web3Eth(web3.currentProvider);
  const creator = web3Eth.accounts.wallet.add(creatorPrivateKey); // web3Eth.accounts.privateKeyToAccount(creatorPrivateKey);
  const producer = web3Eth.accounts.wallet.add(producerPrivateKey); // web3Eth.accounts.privateKeyToAccount(producerPrivateKey)
  const supplier = web3Eth.accounts.wallet.add(supplierPrivateKey); // web3Eth.accounts.privateKeyToAccount(supplierPrivateKey)

  let market;
  beforeEach(async () => {
    market = await Market.new();
  });

  it('should have no orders on deploy', async () => {
    let orderCount = await market.getOrderCount();
    assert.equal(orderCount.toNumber(), 0, 'initial order count incorrect.');
  });

  it('should throw when geting an order which does not exist', async () => {
    expectThrow(market.getOrder(10));
  });

  it('a producer should successfully submit an order', async () => {
    await market.submitOrder.sendTransaction(1, 1000, 0, {
      from: producer.address
    });
    const result = await market.getOrder(1);

    const actual_id = result[0];
    const actual_owner = result[1];
    const actual_action = result[2].toNumber();
    const actual_state = result[3].toNumber();
    const actual_quantity = result[4].toNumber();
    const actual_product = result[5].toNumber();
    const actual_unsafeCreatedTimestamp = result[6].toNumber();
    const actual_offerCount = result[7].toNumber();
    const actual_isEnergyDelivered = result[8];

    assert.equal(actual_id, 1, 'the id of the new order should be 1');
    assert.equal(
      actual_state,
      0,
      'the state of the new order should be "Open", which should be declared first in the State Enum'
    );
    assert.equal(
      actual_owner.toUpperCase(),
      producer.address.toUpperCase(),
      'the owner of the new order does not match with the transaction owner'
    );
    assert.equal(
      actual_action,
      1,
      'the action of the new order should be Sell (1)'
    );
    assert.equal(
      actual_quantity,
      1000,
      'the quantity of the new order should be 1000'
    );
    assert.equal(
      actual_product,
      0,
      'the product of the new order should be Day (0)'
    );
    assert.equal(
      actual_offerCount,
      0,
      'the offer count of the new order should be 0'
    );
    assert.equal(
      actual_isEnergyDelivered,
      false,
      'the isEnergyDelivered flag of the new order should be false'
    );
  });
});
