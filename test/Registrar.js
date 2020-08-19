const Registrar = artifacts.require('Registrar');

contract('Registrar', () => {
    let registryAddress = '0x4316d047388e61EBC3Ed34DFf4cEE215840decDa';
    let registryName = 'TestRegistry';
    let registryType = 'RegistryType';

    before(async () => {
        return deployedRegistrar = await Registrar.new();
    });

    it('Create New Registry', async () => {
        const registry = await deployedRegistrar.createRegistry.call(
            registryAddress,
            registryName,
            registryType
        );
        assert.equal(registry[0], registryAddress);
        assert.equal(registry[1], registryName);
        assert.equal(registry[2], registryType);
    });

    it('Get list of Registries from Registrar', async () => {
        const registry = await deployedRegistrar.createRegistry.call(
            registryAddress,
            registryName,
            registryType
        );
        
        const result = await deployedRegistrar.getRegistries.call();
        assert.isNotEmpty(result);
        console.log(result);
    });
});