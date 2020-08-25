const Registry = artifacts.require('Registry');

let name = 'name';
let type = 'type';

contract('Registry', () => {

    before(async () => {
        return deployedRegistry = await Registry.new();
    });

    it('create new registry', async () => {
        const registry = await deployedRegistry.init(name, type);
        assert.isString(name);
        assert.isString(type);
    });

    it('Get Registry Contract address', async () => {
        const registry = await deployedRegistry.getAddress.call();
        assert.isString(registry);
    });
});