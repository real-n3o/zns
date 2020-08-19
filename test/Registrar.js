const Registrar = artifacts.require('Registrar');

contract('Registrar', () => {
    before(async () => {
        registrarDeployed = await Registrar.new();
    });

    it('Create New Registrar', () => {
        let address = '0x0';
        let registryName = 'TestRegistry';
        let registryType = 'RegistryType';

        registrarDeployed.createRegistry.call(
            address,
            registryName,
            registryType
        );
    });
});