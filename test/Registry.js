const Registry = artifacts.require('Registry');

let name = 'name';
let type = 'type';

contract('Registry', () => {

    before(async () => {
        return deployedRegistry = await Registry.new();
    });

    it('Create Registry', async () => {
        const registry = await deployedRegistry.init(name, type);
        assert.isString(registry.tx);
    });

    it('Set Registry stakePrice', async () => {
        const registryStakePrice = await deployedRegistry.setStakePrice(250);
        assert.isString(registryStakePrice.tx);
    });

    it('Get Registry Contract address', async () => {
        const registry = await deployedRegistry.getAddress.call();
        assert.isString(registry);
    });
});