const RegistryToken = artifacts.require('RegistryToken.sol');
const Registry = artifacts.require('Registry.sol');

contract('RegistryToken', (accounts) => { 

    let testAddress = '0x1770579e56dab8823cb7b4f16b664c71c34cee5e';
    let tokenName = 'Meow';
    let tokenSymbol = "INI";
    let tokenSupply = 1020;
    let stakePrice = 2150;
    let newStakePrice = 3313;

    let registryToken;
    let owner = accounts[0];

    // Creators

    it('deploy a new registry token', async () => {
        registryToken = await RegistryToken.new();
        registryToken.initialize(owner, tokenName, tokenSymbol, tokenSupply, stakePrice);
        assert.isString(registryToken.address);
    });

    it('address is not a staker', async () => {
        const isStaker = await registryToken.isStaker(testAddress);
        assert.isNotTrue(isStaker[0]);
        assert.equal(isStaker[1].toNumber(), 0);
    });

    it('send stake to a registry tokens wallet', async () => {
        let depositStake = await registryToken.depositStake.sendTransaction({
            from: accounts[0],
            value: stakePrice,
        });
        assert.isString(depositStake.tx);
        let stakerBalance = await registryToken.getBalanceAddress.call(accounts[0]);
        assert.isAtLeast(stakerBalance.toNumber(), stakePrice);
    });

    it('add staker after stake has been sent', async () => {
        let stakerBalance = await registryToken.getBalanceAddress.call(accounts[0]);
        assert.isNumber(stakerBalance.toNumber());
    });

    it('withdraw a stake from a registry token wallet', async() => {
        let withdrawStake = await registryToken.withdrawStake.sendTransaction({
            from: accounts[0],
            value: stakePrice
        });        
        assert.isString(withdrawStake.tx);
        let stakerBalance = await registryToken.getBalanceAddress.call(accounts[0]);
        assert.isBelow(stakerBalance.toNumber(), stakePrice);
    });
    
    // Setters

    it('set stake price', async () => {
        let setStakePrice = await registryToken.setStakePrice(newStakePrice);
        assert.isString(setStakePrice.tx);
        let returnedStakePrice = await registryToken.stakePrice.call();
        assert.equal(returnedStakePrice.toNumber(), newStakePrice);
    });

    // Getters

    it('check if address is a staker', async () => {
        await registryToken.depositStake.sendTransaction({
            from: accounts[0],
            value: newStakePrice,
        });
        const isStaker = await registryToken.isStaker(accounts[0]);
        assert.isTrue(isStaker[0]);
        assert.isNumber(isStaker[1].toNumber());
    });

    it('get the total balance of the registry token', async () => {
        const totalBalance = await registryToken.getBalance.call();
        assert.isNumber(totalBalance.toNumber());
    });

    it('get an individual accounts registry token balance', async () => {
        let addressBalance = await registryToken.getBalanceAddress.call(accounts[0]);
        assert.isNumber(addressBalance.toNumber());
    });

    it('get registry token name', async() => {
        let tokenName = await registryToken.name.call();
        assert.isString(tokenName);
    });

    it('get registry token symbol', async() => {
        let tokenSymbol = await registryToken.symbol.call();
        assert.isString(tokenSymbol);
    });

    it('get registry token total supply', async() => {
        let tokenSupply = await registryToken.totalSupply.call();
        assert.isNumber(tokenSupply.toNumber());
    });
});