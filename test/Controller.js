const Controller = artifacts.require('Controller');
const Registry = artifacts.require('Registry');
const StakeToken = artifacts.require('StakeToken');

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

contract('controller', (accounts) => {
    let controller;
    let registryAddress;
    let stakeTokenAddress;

    before(async () => {
        controller = await Controller.new();
        return controller;
    });

    it('create registry', async () => {
        await controller.createRegistry(
            domain,
            ref,
            registryType,
            tokenName,
            tokenSymbol,
            tokenSupply,
            stakePrice)
        registryAddress = await controller.registryAddress.call();
        console.log(registryAddress);
    });

    it('set stake price for registry', async () => {
        stakeTokenAddress = await controller.stakeTokenAddress.call();
        stakeToken = await StakeToken.at(stakeTokenAddress);
        let currentStakePrice = await stakeToken.stakePrice.call();
        assert.equal(currentStakePrice.toNumber(), stakePrice);
        await controller.setStakePrice(registryAddress, newStakePrice);
        let updatedStakePrice = await stakeToken.stakePrice.call();
        assert.equal(updatedStakePrice.toNumber(), newStakePrice);
    });

    it('create registry entry', async () => {
        let registryAddress = await controller.registryAddress.call();
        let registry = await Registry.at(registryAddress);
        await registry.createRegistryEntry(subdomain, subdomainRef);
        let returnedSubdomainRef = await registry.getRegistryEntryRef(subdomain);
        assert.isString(returnedSubdomainRef, subdomainRef);

        // take proper stake (where will this logic be?) ... should this be done as part of creation? Likely...
    });
   
});