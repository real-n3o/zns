const Registrar = artifacts.require('Registrar');

let domain = 'TestRegistry';
let ref = 'ref';
let registryType = 'RegistryType';
let tokenName = "Meow";
let tokenTicker = "MWM";
let tokenSupply = 500;
let stakePrice = 250;

contract('Registrar', () => {
        
    let deployedRegistrar;

    before(async () => {
        deployedRegistrar = await Registrar.new();
        return deployedRegistrar;
    });

    it('Create Registry', async () => {
        registry = await deployedRegistrar.createRegistry.sendTransaction(
            domain,
            ref,
            registryType,
            tokenName,
            tokenTicker,
            tokenSupply,
            stakePrice
        );
        assert.isString(registry.tx);
    }); 

    it('Get total number of Registries', async () => {
        const totalRegistries = await deployedRegistrar.getRegistrarLength.call();
        assert.isNumber(totalRegistries.toNumber());
    });

    it('Get Registry entry contract address', async () => {
        const registryAddress = await deployedRegistrar.getRegistryAddress.call(domain);
        assert.isString(registryAddress);
    });

    it('Get Registry entry type', async () => {
        const registryType = await deployedRegistrar.getRegistryType.call(domain);
        assert.isString(registryType);
    });
});