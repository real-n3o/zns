const Registry = artifacts.require('Registry');
const StakeToken = artifacts.require('StakeToken');

let domain = 'domain';
let ref = 'ref';
let type = 'type';
let tokenName = 'Meow';
let tokenSymbol = "MWM";
let tokenSupply = 100;
let stakePrice = 250;

contract('Registry', (accounts) => {

    let stakeToken;
    let registry;
    const owner = accounts[0];

    before(async () => {
        stakeToken = await StakeToken.new(owner, tokenName, tokenSymbol, tokenSupply);
        registry = await Registry.new(); 
    });

    it('Create Registry', async () => {
        const newRegistry = await registry.init(domain, ref, type, stakeToken.address);
        assert.isString(newRegistry.tx);
    });

    // Setters

    it('Set Registry stakePrice', async () => {
        const registryStakePrice = await registry.setStakePrice(stakePrice);
        assert.isString(registryStakePrice.tx);
    });

    // Getters

    it('Get Registry Contract address', async () => {
        const registryAddress = await registry.getAddress.call();
        assert.isString(registryAddress);
    });

    it('Get Registry ref', async () => {
        const registryRef = await registry.getRef.call();
        assert.isString(registryRef);
    });
});