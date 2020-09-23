const Registrar = artifacts.require('Registrar');
const Registry = artifacts.require('Registry');
const RegistryToken = artifacts.require('RegistryToken');

contract('Registrar', (accounts) => {

    let domain = 'TestRegistry';
    let ref = 'ref';
    let registryType = 'RegistryType';
    let tokenName = "Meow";
    let tokenSymbol = "MWM";
    let tokenSupply = 500;
    let stakePrice = 250;

    let deployedRegistrar;
    let registryToken;
    let owner = accounts[0];

    it('create registrar', async () => {    
        deployedRegistrar = await Registrar.new();
        assert.isString(deployedRegistrar.address);
    });

    // Creators

    it('create registry', async () => {
        registryToken = await RegistryToken.new();

        createRegistry = await deployedRegistrar.createRegistry.sendTransaction(
            domain,
            ref,
            registryType,
            stakePrice,
            owner,
            registryToken.address
        );

        assert.isString(createRegistry.tx);
        assert.equal(createRegistry.logs.length, 1);
        assert.equal(createRegistry.logs[0].event, 'RegistryCreated');
        assert.equal(createRegistry.logs[0].args[0], domain);
        assert.equal(createRegistry.logs[0].args[1], ref);
        assert.equal(createRegistry.logs[0].args[2], registryType);
        assert.equal(createRegistry.logs[0].args[3], stakePrice);
        assert.lengthOf(createRegistry.logs[0].args[4], 42);
        assert.lengthOf(createRegistry.logs[0].args[5], 42);
        assert.lengthOf(createRegistry.logs[0].args[6], 42);
    }); 

    // Getters

    it('get total number of registries', async () => {
        const totalRegistries = await deployedRegistrar.getRegistrarLength.call();
        assert.isNumber(totalRegistries.toNumber());
    });

    it('get registry controller address', async () => {
        const registryController = await deployedRegistrar.getRegistryController.call(domain);
        assert.isString(registryController);
    });

    it('get registry entry type', async () => {
        const registryType = await deployedRegistrar.getRegistryType.call(domain);
        assert.isString(registryType);
    });
});