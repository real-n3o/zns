const Registry = artifacts.require('Registry');
const StakeToken = artifacts.require('StakeToken');

let domain = 'domain';
let ref = 'ref';
let newRef = "newRef";
let registryType = 'type';
let tokenName = 'Meow';
let tokenSymbol = "MWM";
let tokenSupply = 100;
let stakePrice = 250;

let registryEntrySubdomain = "subdomain";
let registryEntryRef = "subdomain_ref";

let newRegistryEntrySubdomain = "new_subdomain";
let newRegistryEntryRef = "new_subdomain_ref";

contract('Registry', (accounts) => {

    let stakeToken;
    let registry;
    const owner = accounts[0];

    before(async () => {
        stakeToken = await StakeToken.new(owner, tokenName, tokenSymbol, tokenSupply, stakePrice);
        registry = await Registry.new(); 
    });

    // Creators

    it('create a new registry', async () => {
        const newRegistry = await registry.init(domain, ref, registryType, stakeToken.address);
        assert.isString(newRegistry.tx);
    });

    it('create a new registry entry', async () => {
        registryEntry = await registry.createRegistryEntry(registryEntrySubdomain, registryEntryRef);
        assert.isString(registryEntry.tx);
    });

    // Setters

    it('set registry ref', async () => {
        assert.equal(ref, await registry.getRef());
        await registry.setRegistryRef(newRef);
        assert.equal(newRef, await registry.getRef());
    });

    it('set registry entry ref', async () => {
        assert.equal(registryEntryRef, await registry.getRegistryEntryRef(registryEntrySubdomain));
        await registry.setRegistryEntryRef(registryEntrySubdomain, newRegistryEntryRef);
        assert.equal(newRegistryEntryRef, await registry.getRegistryEntryRef(registryEntrySubdomain));
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

    it('get a registry entries ref', async () => {
        const registryEntryRef = await registry.getRegistryEntryRef(registryEntrySubdomain);
        assert.isString(registryEntryRef);
    });
});