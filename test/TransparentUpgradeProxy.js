const Registrar = artifacts.require('Registrar');
const RegistryV2Mock = artifacts.require('RegistryV2Mock.sol');
const RegistryControllerV2Mock = artifacts.require('RegistryControllerV2Mock.sol');
const RegistryToken = artifacts.require('RegistryToken.sol');
const Registry = artifacts.require('Registry.sol');
const RegistryController = artifacts.require('RegistryController.sol');
const TransparentUpgradeableProxy = artifacts.require('TransparentUpgradeableProxy.sol');
const ProxyAdmin = artifacts.require('ProxyAdmin.sol');

contract('TransparentUpgradeProxyTests', (accounts) => { 

    let tokenName = 'Meow';
    let tokenSymbol = "INI";
    let tokenSupply = 1020;
    let stakePrice = 2150;

    let domain = "domain";
    let ref = "ref";
    let registryType = "type";

    let owner = accounts[0];
    let contractOwner = accounts[1];

    let deployedRegistrar;

    let registryToken;
    let registryTokenProxyAddress;
    let registryTokenProxy;

    let registry;
    let registryProxyAddress;
    let registryProxy;

    let registryControllerProxyAddress;
    let registryControllerProxy;

    let transparentUpgradeableRegistryProxy;   
    let transparentUpgradeableRegistryControllerProxy 
    
    let proxyAdmin;
    let registryV2Mock;

    let newUpgradeVar = "newUpgradeVar";

    it('deploy registrar', async () => {
        deployedRegistrar = await Registrar.new();
        assert.isString(deployedRegistrar.address);
    });

    // Upgrading the Registry Contract

    it('change the admin of a registry proxy via registry controller', async () => {
        // First, we need to create a new Registry from the Registrar.

        registryToken = await RegistryToken.new();

        createRegistry = await deployedRegistrar.createRegistry.sendTransaction(
            domain,
            ref,
            registryType,
            stakePrice,
            contractOwner,
            registryToken.address
        );

        assert.isString(createRegistry.tx);
        assert.equal(createRegistry.logs.length, 1);
        assert.equal(createRegistry.logs[0].event, 'RegistryCreated');
        assert.equal(createRegistry.logs[0].args[0], domain);
        assert.equal(createRegistry.logs[0].args[1], ref);
        assert.equal(createRegistry.logs[0].args[2], registryType);
        assert.equal(createRegistry.logs[0].args[3], stakePrice);

        // Second, we need to create Proxy instances of each of the main Registry contracts.

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

        transparentUpgradeableRegistryProxy = await TransparentUpgradeableProxy.at(registryProxyAddress);

        // Fourth, we are going to transfer ownership of the Proxy to the ProxyAdmin Contract.

        proxyAdmin = await ProxyAdmin.new();
        proxyAdmin.initialize(owner);

        // -- Note: Because the owner is msg.sender, we have to call the TransparentUpgradeProxy admin() method from that address.
        let currentRegistryProxyOwner = await transparentUpgradeableRegistryProxy.admin.call();
        assert.equal(currentRegistryProxyOwner, owner);
        
        await transparentUpgradeableRegistryProxy.changeAdmin.sendTransaction(proxyAdmin.address);  

        // Fifth, we will use ProxyAdmin to call and verify the admin has been updated.
        // -- Note: Now that the admin has been changed, the TransparentUpgradeProxy admin() method must be called from the new Admin (in this case the ProxyAdmin contract).

        let newRegistryProxyOwner = await proxyAdmin.getTransparentProxyAdmin.call(registryProxyAddress);
        assert.lengthOf(newRegistryProxyOwner, 42);
        assert.equal(newRegistryProxyOwner, proxyAdmin.address);
    }); 

    it('upgrade registry proxy to new implementation contract (RegistryV2Mock)', async () => {
        // First, we'll create a new instance and initialization of the RegistryV2Mock contract.
        // -- Note: We are creating an Implementation Contract (also known as a Logic Contract) that the Proxy will reference.

        registryV2Mock = await RegistryV2Mock.new();
        registryV2Mock.initialize(
            domain,
            ref,
            registryType,
            registryToken.address
        );

        // Second, we'll upgrade the Registry Proxy Implementation Contract via the Proxy Admin Contract.

        await proxyAdmin.upgradeTransparentProxy.sendTransaction(registryProxy.address, registryV2Mock.address);

        let newImplementationProxy = await proxyAdmin.getProxyImplementation.call(registryProxy.address);
        assert.lengthOf(newImplementationProxy, 42);
        assert.equal(newImplementationProxy, registryV2Mock.address);

        // Third, reinitialize local registryProxy var with upgraded registryV2Mock interface.

        registryProxy = await RegistryV2Mock.at(registryProxy.address);
    });

    it('get ref in v2 registry contract (old method)', async () => {
        let getExistingRef = await registryProxy.getRef.call( { from: contractOwner } );
        assert.equal(getExistingRef, ref);
    });

    it('set new ref in v2 registry contract (old method)', async () => {
        let newRef = "newRef";
        let txGetNewRef = await registryControllerProxy.setRef.sendTransaction(newRef, { from: contractOwner } );
        let getNewRef = await registryProxy.getRef.call();
        
        assert.equal(getNewRef, newRef);
        assert.equal(txGetNewRef.logs.length, 2);
        assert.equal(txGetNewRef.logs[0].event, 'RegistryRefSet');    
        assert.equal(txGetNewRef.logs[0].args[0], newRef);
    });

    it('set newUpgradeVar on v2 registry contract (new method)', async () => {
        let txNewSetUpgradeVar = await registryProxy.setNewUpgradeVar.sendTransaction(newUpgradeVar, { from: contractOwner } );

        assert.equal(txNewSetUpgradeVar.logs.length, 1);
        assert.equal(txNewSetUpgradeVar.logs[0].event, 'NewUpgradeVarSet');    
        assert.equal(txNewSetUpgradeVar.logs[0].args[0], newUpgradeVar);
    });

    it('get newUpgradeVar on v2 registry contract (new method)', async () => {
        let getNewUpgradeVar = await registryProxy.getNewUpgradeVar.call({ from: contractOwner });
        assert.equal(getNewUpgradeVar, newUpgradeVar);
    })

    // Upgrading the Controller Contract

    // Update Admin to ProxyAdmin

    it('change admin of RegistryController Proxy to ProxyAdmin', async () => {
        transparentUpgradeableRegistryControllerProxy = await TransparentUpgradeableProxy.at(registryControllerProxy.address);
        let currentRegistryControllerProxyOwner = await transparentUpgradeableRegistryControllerProxy.admin.call();
        assert.equal(currentRegistryControllerProxyOwner, owner);
        
        await transparentUpgradeableRegistryControllerProxy.changeAdmin.sendTransaction(proxyAdmin.address);  

        let newRegistryControllerProxyOwner = await proxyAdmin.getTransparentProxyAdmin.call(registryControllerProxy.address);
        assert.lengthOf(newRegistryControllerProxyOwner, 42);
        assert.equal(newRegistryControllerProxyOwner, proxyAdmin.address);
    });
    
    it('upgrade registry controller proxy to new implementation contract (ControllerV2Mock)', async () => {
        // First, we'll create a new instance and initialization of the ControllerV2Mock contract.

        controllerV2Mock = await RegistryControllerV2Mock.new();
        controllerV2Mock.initialize(
            registryProxy.address,
            registryTokenProxy.address,
            contractOwner
        );

        // Second, we'll upgrade the registry controller Proxy Implementation Contract via the Proxy Admin Contract.

        await proxyAdmin.upgradeTransparentProxy.sendTransaction(registryControllerProxy.address, controllerV2Mock.address);
        let newImplementationProxy = await proxyAdmin.getProxyImplementation.call(registryControllerProxy.address);
        assert.lengthOf(newImplementationProxy, 42);
        assert.equal(newImplementationProxy, controllerV2Mock.address);

        // Third, reinitialize local registryProxy var with upgraded registryV2Mock interface.

        registryProxyController = await RegistryControllerV2Mock.at(registryControllerProxy.address);
    });

});