const Registry = artifacts.require('Registry');
const StakeToken = artifacts.require('StakeToken');

let domain = 'domain';
let type = 'type';
let stakePrice = 250;
let stakeTokenInitialSupply = 100;

contract('Registry', (accounts) => {

    let stakeToken;
    let registry;
    const owner = accounts[0];

    before(async () => {
        stakeToken = await StakeToken.new(owner, stakeTokenInitialSupply);
        registry = await Registry.new(); 
    });

    it('Create Registry', async () => {
        const newRegistry = await registry.init(domain, type, stakeToken.address);
        assert.isString(newRegistry.tx);
    });

    it('Set Registry stakePrice', async () => {
        const registryStakePrice = await registry.setStakePrice(stakePrice);
        assert.isString(registryStakePrice.tx);
    });

    it('Get Registry Contract address', async () => {
        const registryAddress = await registry.getAddress.call();
        assert.isString(registryAddress);
    });
});