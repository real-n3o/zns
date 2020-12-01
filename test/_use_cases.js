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
    let contractOwner = accounts[1];

    let subdomain = 'TestSubDomain';
    let subdomainRef = 'subdomainRef';

    let updatedRef = 'updatedRef';
    let updatedStakePrice = 1337;
    let updatedRegistryEntryRef = 'updatedRegistryEntryRef';

    let registrar;
    let registryToken;
    let registryController;

    let registryAddress;
    let registryTokenAddress;
    let registryControllerAddress;

    // Use-case 0: Deploy the Registrar.

    it('create registrar', async () => {    
        registrar = await Registrar.new();
        assert.isString(registrar.address);
        assert.lengthOf(registrar.address, 42);
    });

    // Use-case 1: Register a new ZNS domain.

    it('register a new ZNS domain (a Registry)', async () => {
        // First, we need to create and initialize a new RegistryToken.
        
        registryToken = await RegistryToken.new();
        let txInitialize = await registryToken.initialize(
            accounts[0],
            tokenName,
            tokenSymbol,
            tokenSupply,
            stakePrice,
        );

        registryToken.transferOwnership(owner);

        registryTokenAddress = registryToken.address;

        assert.isString(registryTokenAddress);
        assert.lengthOf(registryTokenAddress, 42);

        assert.equal(txInitialize.logs.length, 2);
        assert.equal(txInitialize.logs[1].event, 'RegistryTokenCreated');
        
        assert.equal(txInitialize.logs[1].args[0], owner);
        assert.lengthOf(txInitialize.logs[1].args[0], 42);

        assert.isString(txInitialize.logs[1].args[1]);
        assert.equal(txInitialize.logs[1].args[1], tokenName);

        assert.isString(txInitialize.logs[1].args[2]);
        assert.equal(txInitialize.logs[1].args[2], tokenSymbol);

        assert.isNumber(txInitialize.logs[1].args[3].toNumber());
        assert.equal(txInitialize.logs[1].args[3], tokenSupply);

        assert.isNumber(txInitialize.logs[1].args[4].toNumber());
        assert.equal(txInitialize.logs[1].args[4], stakePrice);

        // Second, we need to create a new Registry from the Registrar and then initialize it.

        let txCreateRegistry = await registrar.createRegistry(
            domain,
            ref,
            registryType,
            stakePrice,
            contractOwner,
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

        registryController = await RegistryController.at(registryControllerAddress);
    });

    // Use-case 2: Register a new ZNS sub-domain.

    it('register a new ZNS sub-domain (a Registry Entry)', async () => {
        // First, we need to create a Registry Entry via the RegistryController.
        // -- Note: Using deployed version of registryController from prior test.
        // --       When calling a Proxy Contract, the call must be initiated from an account OTHER than the admin address controlling the proxy.
        // --       See: https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#transparent-proxies-and-function-clashes

        txCreateRegistryEntry = await registryController.createRegistryEntry.sendTransaction(
            subdomain,
            subdomainRef,
            { from: contractOwner }
        );

        assert.equal(txCreateRegistryEntry.logs.length, 1);
        assert.equal(txCreateRegistryEntry.logs[0].event, 'CreatedRegistryEntry');

        assert.isString(txCreateRegistryEntry.logs[0].args[0]);
        assert.equal(txCreateRegistryEntry.logs[0].args[0], subdomain);

        assert.isString(txCreateRegistryEntry.logs[0].args[1]);
        assert.equal(txCreateRegistryEntry.logs[0].args[1], subdomainRef);
    });

    // Use-case 3: Update the Ref for a domain.

    it('update the ref for a domain (Registry)', async () => {
        let txSetRef = await registryController.setRef.sendTransaction(
            updatedRef,
            { from: contractOwner }
        );

        assert.equal(txSetRef.logs.length, 2);
        assert.equal(txSetRef.logs[0].event, 'RegistryRefSet');
        assert.isString(txSetRef.logs[0].args[0]);
        assert.equal(txSetRef.logs[0].args[0], updatedRef);

        let getRef = await registryController.getRef.call({ from: contractOwner });

        assert.equal(getRef, updatedRef);
    });

    // Use-case 4: Update the stake price for registering a new sub-domain within the Registry.

    it('update the stake Price for registering a new sub-domain (Registry Entry)', async () => {
        await registryToken.transferOwnership(registryController.address);
        let txSetStakePrice = await registryController.setStakePrice.sendTransaction(
            updatedStakePrice, 
            { from: contractOwner }
        );

        assert.equal(txSetStakePrice.logs.length, 2);
        assert.equal(txSetStakePrice.logs[0].event, 'StakePriceSet');

        assert.isNumber(txSetStakePrice.logs[0].args[0].toNumber());
        assert.equal(txSetStakePrice.logs[0].args[0], updatedStakePrice);

        let getStakePrice = await registryController.getStakePrice.call({ from: contractOwner });

        assert.equal(getStakePrice, updatedStakePrice);
    });

    // Use-case 5: Update the ref of a sub-domain within the Registry.

    it('update the ref of a sub-domain (Registry Entry)', async () => {
        let txSetRegistryEntryRef = await registryController.setRegistryEntryRef.sendTransaction(
            subdomain, 
            updatedRegistryEntryRef,
            { from: contractOwner }
        );

        assert.equal(txSetRegistryEntryRef.logs.length, 1);
        assert.equal(txSetRegistryEntryRef.logs[0].event, 'RegistryEntryRefSet');

        assert.isString(txSetRegistryEntryRef.logs[0].args[0]);
        assert.equal(txSetRegistryEntryRef.logs[0].args[0], subdomain);

        assert.isString(txSetRegistryEntryRef.logs[0].args[1]);
        assert.equal(txSetRegistryEntryRef.logs[0].args[1], updatedRegistryEntryRef);

        let getRegistryEntryRef = await registryController.getRegistryEntryRef.call(
            subdomain,
            { from: contractOwner }
        );

        assert.equal(getRegistryEntryRef, updatedRegistryEntryRef);
    });
});