const Controller = artifacts.require('Controller');
const Registry = artifacts.require('Registry');
const StakeToken = artifacts.require('StakeToken');

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
    let registryAddress;
    let stakeTokenAddress;

    before(async () => {
        controller = await Controller.new();
        return controller;
    });

    it('create registrar', async () => {
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
        updatedStakePrice = await stakeToken.stakePrice.call();

        // await controller.setStakePrice(registryAddress, newStakePrice);
        // registry = await Registry.at(registryAddress);


        // let updatedStakePrice = await registry.stakePrice.call();
        // assert.equal(updatedStakePrice.toNumber(), newStakePrice);
    });

    it('create registry entry', async () => {
        // get registry address from registrar
        // create new instance of registry contract
        // take proper stake (where will this logic be?)
        // create registry entry (need to determine fields)
        // confirm registry entry has been added and fields have been updated
    });
   
});