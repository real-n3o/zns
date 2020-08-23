const Registrar = artifacts.require('Registrar');

let registryAddress = '0x4316d047388e61EBC3Ed34DFf4cEE215840decDa';
let registryName = 'TestRegistry';
let registryType = 'RegistryType';

async function newRegistry() {

    const registry = await deployedRegistrar.createRegistry.call(
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
        assert.isString(registry[0], registryAddress);
        assert.equal(registry[1], registryName);
        assert.equal(registry[2], registryType);  
    }); 

    it('Get total number of Registries', async () => {
        const totalRegistries = await deployedRegistrar.getRegistrarLength.call();
        assert.isNumber(totalRegistries.toNumber());
    });

    it('Get list of Registries', async () => {
        const registrar = await deployedRegistrar.getRegistrarList.call();
        console.log(registrar);
        assert.isString(registrar);
    });
});