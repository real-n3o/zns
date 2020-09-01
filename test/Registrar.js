const Registrar = artifacts.require('Registrar');

let domain = 'TestRegistry';
let ref = 'ref';
let registryType = 'RegistryType';
let tokenName = "Meow";
let tokenSymbol = "MWM";
let tokenSupply = 500;
let stakePrice = 250;

contract('Registrar', () => {
        
    let deployedRegistrar;

    before(async () => {
        deployedRegistrar = await Registrar.new();
        return deployedRegistrar;
    });

    // Creators

    it('create registry', async () => {
        registry = await deployedRegistrar.createRegistry.sendTransaction(
            domain,
            ref,
            registryType,
            tokenName,
            tokenSymbol,
            tokenSupply,
            stakePrice
        );
        assert.isString(registry.tx);
    }); 

    // Getters

    it('get total number of registries', async () => {
        const totalRegistries = await deployedRegistrar.getRegistrarLength.call();
        assert.isNumber(totalRegistries.toNumber());
    });

    it('get registry entry contract address', async () => {
        const registryAddress = await deployedRegistrar.getRegistryAddress.call(domain);
        assert.isString(registryAddress);
    });

    it('get registry entry type', async () => {
        const registryType = await deployedRegistrar.getRegistryType.call(domain);
        assert.isString(registryType);
    });
});