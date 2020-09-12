const RegistryController = artifacts.require('RegistryController');
const Registry = artifacts.require('Registry');
const RegistryToken = artifacts.require('RegistryToken');

contract('RegistryController', (accounts) => {
    let controller;
    let registry;
    let registryToken;

    const domain = 'TestRegistry';
    const ref = 'ref';
    const registryType = 'RegistryType';
    const tokenName = "Meow";
    const tokenSymbol = "MWM";
    const tokenSupply = 500;
    const stakePrice = 250;
    const newStakePrice = 333;
    const subdomain = "meow_sub";
    const subdomainRef = "meow_ref";
    const newRef = "newRef";

    before(async () => {
        registryToken = await RegistryToken.new(accounts[0], tokenName, tokenSymbol, tokenSupply, stakePrice);
        
        registry = await Registry.new();
        registry.init(domain, ref, registryType, registryToken.address);

        controller = await RegistryController.new();
        controller.init(registry.address, registryToken.address);
        return controller;
    });

    // Creators

    it('create registry entry', async () => {
        await controller.createRegistryEntry(subdomain, subdomainRef);
        let returnedSubdomainRef = await registry.getRegistryEntryRef(subdomain);
        assert.isString(returnedSubdomainRef, subdomainRef);
    });

    // Setters

    it('set stake price for registry', async () => {
        await controller.setStakePrice(newStakePrice);
        let updatedStakePrice = await controller.stakePrice.call();
        assert.equal(updatedStakePrice.toNumber(), newStakePrice);
    });

    it('set registry ref', async () => {
        const newRegRef = await controller.setRegistryRef(newRef);
        assert.isString(newRegRef.tx);
    });

    it('set registry entry ref', async () => {
        let newEntryRef = await controller.setRegistryEntryRef(subdomain, newRef);
        assert.isString(newEntryRef.tx);
    });

    // getters

    it('get registry ref', async () => {
        let registryRef = await controller.getRef.call();
        assert.isString(registryRef);
    });

    it('get registry stake price', async () => {
        let stakePrice = await controller.getStakePrice.call();
        assert.isNumber(stakePrice.toNumber());
    });

    it('get registry entry ref', async () => {
        let registryEntryRef = await controller.getRegistryEntryRef.call(subdomain);
        assert.isString(registryEntryRef);
    });
   
});

    // get Registry

    // remove RegistryEntry and return Stake
    // put on market

    // Future:
    // -- set max number of registry entries
    // -- create registryType
    // -- get registryType
    // -- remove registryType (only if not in use)