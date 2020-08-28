const Controller = artifacts.require('Controller');

let domain = 'TestRegistry';
let ref = 'ref';
let registryType = 'RegistryType';
let tokenName = "Meow";
let tokenSymbol = "MWM";
let tokenSupply = 500;
let stakePrice = 250;
let newStakePrice = 333;

contract('controller', (accounts) => {
    let controller;
    let registry;

    before(async () => {
        controller = await Controller.new();
        return controller;
    });

    it('create registrar', async () => {
        registry = await controller.createRegistry(
            domain,
            ref,
            registryType,
            tokenName,
            tokenSymbol,
            tokenSupply,
            stakePrice)
    });

    it('set stake price', async () => {
        setStakePrice = await controller.setStakePrice(registry.getAddress(), newStakePrice);

        assert.isNumber(setStakePrice.toNumber());
    });
   
});