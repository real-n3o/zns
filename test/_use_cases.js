const Registrar = artifacts.require('Registrar');
const Registry = artifacts.require('Registry');
const RegistryToken = artifacts.require('RegistryToken');
const RegistryController = artifacts.require('RegistryController');

contract('Core Use Cases', (accounts) => {

    let domain = 'TestRegistry';
    let ref = 'ref';
    let registryType = 'RegistryType';
    let tokenName = "Infinity";
    let tokenSymbol = "INI";
    let tokenSupply = 500;
    let stakePrice = 250;
    let owner = accounts[0];

    let subdomain = 'TestSubDomain';
    let subdomainRef = 'subdomainRef';

    let updatedRef = 'updatedRef';
    let updatedStakePrice = 1337;

    let updatedRegistryEntryRef = 'updatedRegistryEntryRef';
    let updatedRegistryEntryStakePrice = 1337

    let registrar;
    let registryToken;
    let registry;
    let registryController;

    let registryAddress;
    let registryTokenAddress;
    let registryControllerAddress;

    // Use-case 0: Deploy the Registrar.

    it('create Registrar', async () => {    
        registrar = await Registrar.new();
        assert.isString(registrar.address);
        assert.lengthOf(registrar.address, 42);
    });

    // Use-case 1: Register a new ZNS domain.

    it('Register a new ZNS domain (a Registry)', async () => {
        // First, we need to create and initialize a new RegistryToken.
        
        registryToken = await RegistryToken.new();
        let txInitialize = await registryToken.initialize(
            accounts[0],
            tokenName,
            tokenSymbol,
            tokenSupply,
            stakePrice,
        );

        registryTokenAddress = registryToken.address;

        assert.isString(registryTokenAddress);
        assert.lengthOf(registryTokenAddress, 42);

        assert.equal(txInitialize.logs.length, 1);
        assert.equal(txInitialize.logs[0].event, 'RegistryTokenCreated');
        
        assert.equal(txInitialize.logs[0].args[0], owner);
        assert.lengthOf(txInitialize.logs[0].args[0], 42);

        assert.isString(txInitialize.logs[0].args[1]);
        assert.equal(txInitialize.logs[0].args[1], tokenName);

        assert.isString(txInitialize.logs[0].args[2]);
        assert.equal(txInitialize.logs[0].args[2], tokenSymbol);

        assert.isNumber(txInitialize.logs[0].args[3].toNumber());
        assert.equal(txInitialize.logs[0].args[3], tokenSupply);

        assert.isNumber(txInitialize.logs[0].args[4].toNumber());
        assert.equal(txInitialize.logs[0].args[4], stakePrice);

        // Second, we need to create a new Registry from the Registrar and then initialize it.

        let txCreateRegistry = await registrar.createRegistry(
            domain,
            ref,
            registryType,
            stakePrice,
            registryTokenAddress
        );

        assert.equal(txCreateRegistry.logs.length, 1);
        assert.equal(txCreateRegistry.logs[0].event, 'RegistryCreated');

        assert.isString(txCreateRegistry.logs[0].args[0]);
        assert.equal(txCreateRegistry.logs[0].args[0], domain);
        
        assert.isString(txCreateRegistry.logs[0].args[1]);
        assert.equal(txCreateRegistry.logs[0].args[1], ref);

        assert.isString(txCreateRegistry.logs[0].args[2]);
        assert.equal(txCreateRegistry.logs[0].args[2], registryType);

        assert.isNumber(txCreateRegistry.logs[0].args[3].toNumber());
        assert.equal(txCreateRegistry.logs[0].args[3], stakePrice);

        assert.isString(txCreateRegistry.logs[0].args[4]);
        assert.lengthOf(txCreateRegistry.logs[0].args[4], 42);
        assert.equal(txCreateRegistry.logs[0].args[4], registryTokenAddress);

        registryAddress = txCreateRegistry.logs[0].args[5];

        assert.isString(registryAddress);
        assert.lengthOf(registryAddress, 42);

        registryControllerAddress = txCreateRegistry.logs[0].args[6];

        assert.isString(registryControllerAddress);
        assert.lengthOf(registryControllerAddress, 42);

        // Third, we need to create and initialize a RegistryController to manage future Registry interactions. 

        registry = await Registry(registryAddress);

        registryController = await RegistryController.new(registryControllerAddress);
        txRegistryControllerInit = await registryController.initialize(
            registryAddress,
            registryTokenAddress
        );

        assert.equal(txRegistryControllerInit.logs.length, 1);
        assert.equal(txRegistryControllerInit.logs[0].event, 'registryControllerInitialized');

        assert.isString(txRegistryControllerInit.logs[0].args[0]);
        assert.lengthOf(txRegistryControllerInit.logs[0].args[0], 42);
        assert.equal(txRegistryControllerInit.logs[0].args[0], registryAddress);

        assert.isString(txRegistryControllerInit.logs[0].args[1]);
        assert.lengthOf(txRegistryControllerInit.logs[0].args[1], 42);
        assert.equal(txRegistryControllerInit.logs[0].args[1], registryTokenAddress);

    });

    // Use-case 2: Register a new ZNS sub-domain.

    it('Register a new ZNS sub-domain (a Registry Entry)', async () => {
        // First, we need to get the address of the RegistryController for the Registry we want to add the Registry Entry to.

        registryControllerAddress = await registrar.getRegistryController(domain);

        assert.isString(registryControllerAddress);
        assert.lengthOf(registryControllerAddress, 42);

        // Second, we need to create a Registry Entry via the RegistryController.
        // Note: Using deployed version of registryController from prior test

        txCreateRegistryEntry = await registryController.createRegistryEntry(
            subdomain,
            subdomainRef
        );

        assert.equal(txCreateRegistryEntry.logs.length, 1);
        assert.equal(txCreateRegistryEntry.logs[0].event, 'createdRegistryEntry');

        assert.isString(txCreateRegistryEntry.logs[0].args[0]);
        assert.equal(txCreateRegistryEntry.logs[0].args[0], subdomain);

        assert.isString(txCreateRegistryEntry.logs[0].args[1]);
        assert.equal(txCreateRegistryEntry.logs[0].args[1], subdomainRef);
    });

    // Use-case 3: Update the Ref and stake Price for purchasing a new domain.

    it('Update the ref and price of a domain (Registry)', async () => {
        await registryController.setRef(updatedRef);
        let getRef = await registryController.getRef.call();

        assert.equal(getRef, updatedRef);

        await registryController.setStakePrice(updatedStakePrice);
        let getStakePrice = await registryController.getStakePrice.call();

        assert.equal(getStakePrice, updatedStakePrice);
    });

    it('Update the ref of a subdomain (Registry Entry)', async () => {
        await registryController.setRegistryEntryRef(subdomain, updatedRegistryEntryRef);
        let getRegistryEntryRef = await registryController.getRegistryEntryRef.call(subdomain);

        assert.equal(getRegistryEntryRef, updatedRegistryEntryRef);
    });

});