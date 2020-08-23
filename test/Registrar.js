const Registrar = artifacts.require('Registrar');

let registryAddress = '0x4316d047388e61EBC3Ed34DFf4cEE215840decDa';
let registryName = 'TestRegistry';
let registryType = 'RegistryType';

async function newRegistry() {

    const registry = await deployedRegistrar.createRegistry.call(
        registryAddress,
        registryName,
        registryType
    );
    return registry;
}

contract('Registrar', () => {

    before(async () => {
        return deployedRegistrar = await Registrar.new();
    });

    it('Create New Registry', async () => {
        registry = await newRegistry();
        assert.equal(registry[0], registryAddress);
        assert.equal(registry[1], registryName);
        assert.equal(registry[2], registryType);
    });

    it('Get total number of Registries', async () => {
        newRegistry();
        
        const result = await deployedRegistrar.getRegistries.call();
        assert.isNumber(result);
        console.log(result);
    });
});