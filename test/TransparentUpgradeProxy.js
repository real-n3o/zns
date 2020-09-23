const Registrar = artifacts.require('Registrar');
const RegistryV2Mock =artifacts.require('RegistryV2Mock.sol');
const RegistryToken = artifacts.require('RegistryToken.sol');
const Registry = artifacts.require('Registry.sol');
const RegistryController = artifacts.require('RegistryController.sol');
const TransparentUpgradeableProxy = artifacts.require('TransparentUpgradeableProxy.sol');

contract('TransparentUpgradeProxyTests', (accounts) => { 

    let tokenName = 'Meow';
    let tokenSymbol = "INI";
    let tokenSupply = 1020;
    let stakePrice = 2150;

    let domain = "domain";
    let ref = "ref";
    let registryType = "type";

    let registry;
    let registryToken;
    let owner = accounts[0];
    let newOwner = accounts[1];

    let deployedRegistrar;

    let registryTokenProxyAddress;
    let registryTokenProxy;

    let registryProxyAddress;
    let registryProxy;

    let registryControllerProxyAddress;
    let registryControllerProxy;

    let transparentUpgradeableProxy;
    
    let registryV2;

    it('deploy registrar', async () => {
        deployedRegistrar = await Registrar.new();
        assert.isString(deployedRegistrar.address);
    });

    // Creators

    it('create a new registry, relevant proxies, and update the proxy admin to the controller contract', async () => {
        // First, we need to create a new Registry from the Registrar.

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

        // Second, we need to create Proxy instances of each main contract.

        registryTokenProxyAddress = createRegistry.logs[0].args[4];
        assert.lengthOf(createRegistry.logs[0].args[4], 42);
        registryTokenProxy = await RegistryToken.at(registryTokenProxyAddress);

        registryProxyAddress = createRegistry.logs[0].args[5];
        assert.lengthOf(createRegistry.logs[0].args[5], 42);
        registryProxy = await Registry.at(registryProxyAddress);

        registryControllerProxyAddress = createRegistry.logs[0].args[6];
        assert.lengthOf(createRegistry.logs[0].args[6], 42);
        registryControllerProxy = await RegistryController.at(registryControllerProxyAddress); 

        // Third, we need to create an instance of the Registry Contract with TransparentUpgradeableProxy.
        // -- Note: Proxy calls are only callable by the proxy contract admin. All other caller methods will be delegated to the implementation contract.

        transparentUpgradeableProxy = await TransparentUpgradeableProxy.at(registryProxyAddress);

        // Fourth, we are going to transfer ownership of the Proxy to the RegistryController Contract.

        let currentRegistryProxyOwner = await transparentUpgradeableProxy.admin.call();
        assert.equal(currentRegistryProxyOwner, owner);

        await transparentUpgradeableProxy.changeAdmin.sendTransaction(registryControllerProxyAddress, { from: owner } );  

        // Fifth, we will use our Registry Controller proxy instance to call and verify the admin has been updated.

        let newRegistryProxyOwner = await registryControllerProxy.getTransparentProxyAdmin.call(registryProxyAddress, { from: newOwner } );
        assert.equal(newRegistryProxyOwner, registryControllerProxyAddress);
    }); 

    it('upgrade registry', async () => {
        // TO DO
        // console.log('deployedRegistrar: ' + deployedRegistrar.address);
        // console.log('Current account: ' + owner);
        // console.log('ControllerProxy: ' + registryControllerProxyAddress);
        // console.log('RegistryProxyAdmin: ' + await registryProxy.owner.call( { from: accounts[1] } ));
        // console.log('Registry V1 Owner: ' + await registryProxy.owner.call( { from: accounts[1] } ));

        // let getTransparentProxyAdmin = await registryControllerProxy.admin(
        //     registryProxyAddress,
        //     { from: accounts[0] } 
        // );

        // console.log(getTransparentProxyAdmin);

        // console.log(await transparentUpgradeableProxy.admin.call());

        // console.log(await registryProxy.admin.call())
        // create controller proxy instance (controller is owner)
        // confirm controller proxy is admin
        // create single controller function to upgrade RegistryContract
        // test existing functions/methods work on controller
        // test new functionality exists on controller
    });
});
