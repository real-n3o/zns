const Registrar = artifacts.require('Registrar');

let registryName = 'TestRegistry';
let registryType = 'RegistryType';

contract('Registrar', () => {
    
    let deployedRegistrar;

    before(async () => {
        deployedRegistrar = await Registrar.new();
        return deployedRegistrar;
    });

    it('Create new Registry', async () => {
        registry = await deployedRegistrar.createRegistry.sendTransaction(
            registryName,
            registryType
        );
        assert.isString(registry.tx);
    }); 

    it('Get total number of Registries', async () => {
        const totalRegistries = await deployedRegistrar.getRegistrarLength.call();
        assert.isNumber(totalRegistries.toNumber());
    });

    it('Get Registry entry contract address', async () => {
        const registryAddress = await deployedRegistrar.getRegistryAddress.call(registryName);
        assert.isString(registryAddress);
    });

    it('Get Registry entry type', async () => {
        const registryType = await deployedRegistrar.getRegistryType.call(registryName);
        assert.isString(registryType);
    });
});