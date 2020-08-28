const Registry = artifacts.require('Registry');
const StakeToken = artifacts.require('StakeToken');

let domain = 'domain';
let ref = 'ref';
let registryType = 'type';
let tokenName = 'Meow';
let tokenSymbol = "MWM";
let tokenSupply = 100;
let stakePrice = 250;

contract('Registry', (accounts) => {

    let stakeToken;
    let registry;
    const owner = accounts[0];

    before(async () => {
        stakeToken = await StakeToken.new(owner, tokenName, tokenSymbol, tokenSupply, stakePrice);
        registry = await Registry.new(); 
    });

    it('create a new registry', async () => {
        const newRegistry = await registry.init(domain, ref, registryType, stakeToken.address);
        assert.isString(newRegistry.tx);
    });

    // Setters

    it('set a registries stake price', async () => {
        const registryStakePrice = await registry.setStakePrice(stakePrice);
        assert.isString(registryStakePrice.tx);
    });

    // Getters

    it('get a registries address', async () => {
        const registryAddress = await registry.getAddress.call();
        assert.isString(registryAddress);
    });

    it('get a registries ref', async () => {
        const registryRef = await registry.getRef.call();
        assert.isString(registryRef);
    });
});