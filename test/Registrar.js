const Registrar = artifacts.require('Registrar');

contract('Registrar', () => {
    before(async () => {
        deployedRegistrar = await Registrar.new();
    });

    it('Create New Registry', () => {
        let address = '0x0';
        let registryName = 'TestRegistry';
        let registryType = 'RegistryType';

        deployedRegistrar.createRegistry.call(
            address,
            registryName,
            registryType
        );
    });


    it('Get Registries from Registrar', () => {
        deployedRegistrar.getRegistries.call();
    });
});

