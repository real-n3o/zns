const StakeToken = artifacts.require('StakeToken.sol');

let testAddress = '0x1770579e56dab8823cb7b4f16b664c71c34cee5e';
let tokenName = "Meow Token";
let tokenSymbol = "MEOW";
let tokenSupply = 100;
let stakePrice = 250;
let newStakePrice = 333;

contract('StakeToken', (accounts) => { 

    let stakeToken;
    const owner = accounts[0];

    // Creators

    it('deploy StakeToken and mint tokens to address', async () => {
        stakeToken = await StakeToken.new(owner, tokenName, tokenSymbol, tokenSupply, stakePrice);
        assert.isString(stakeToken.address);
    });

    it('add staker', async () => {
        const addStaker = await stakeToken.addStaker(testAddress);
        assert.isString(addStaker.tx);
        let stakerBalance = await stakeToken.getBalanceAddress.call(testAddress);
        assert.equal(stakerBalance.toNumber(), 0);
    });

    it('address is not a staker', async () => {
        await stakeToken.addStaker(accounts[0]);
        const isStaker = await stakeToken.isStaker(testAddress);
        assert.isNotTrue(isStaker[0]);
        assert.equal(isStaker[1].toNumber(), 0);
    });

    it('remove staker', async () => {
        const removeStaker = await stakeToken.removeStaker(accounts[0]);
        assert.isString(removeStaker.tx);
    });

    it('send stake to a stake tokens wallet', async () => {
        let sendStake = await stakeToken.sendStake.sendTransaction({
            from: accounts[0],
            value: stakePrice,
        });
        assert.isString(sendStake.tx);
        let stakerBalance = await stakeToken.getBalanceAddress.call(accounts[0]);
        assert.isAtLeast(stakerBalance.toNumber(), stakePrice);
    });

    it('add staker after stake has been sent', async () => {
        const sendStake = await stakeToken.addStaker(accounts[0]);
        assert.isString(sendStake.tx);
        let stakerBalance = await stakeToken.getBalanceAddress.call(accounts[0]);
        assert.isNumber(stakerBalance.toNumber());
    });

    it('withdraw a stake from a stake token wallet', async() => {
        let withdrawStake = await stakeToken.withdrawStake.sendTransaction({
            from: accounts[0]
        });        
        assert.isString(withdrawStake.tx);
        let stakerBalance = await stakeToken.getBalanceAddress.call(accounts[0]);
        assert.isBelow(stakerBalance.toNumber(), stakePrice);
    });
    
    // Setters

    it('set stake price', async () => {
        let setStakePrice = await stakeToken.setStakePrice(newStakePrice);
        assert.isString(setStakePrice.tx);
        let returnedStakePrice = await stakeToken.stakePrice.call();
        assert.equal(returnedStakePrice.toNumber(), newStakePrice);
    });

    // Getters

    it('check if address is a staker', async () => {
        const isStaker = await stakeToken.isStaker(accounts[0]);
        assert.isTrue(isStaker[0]);
        assert.isNumber(isStaker[1].toNumber());
    });

    it('get the total balance of the stake token', async () => {
        const totalBalance = await stakeToken.getBalance.call();
        assert.isNumber(totalBalance.toNumber());
    });

    it('get an individual accounts stake token balance', async () => {
        let addressBalance = await stakeToken.getBalanceAddress.call(accounts[0]);
        assert.isNumber(addressBalance.toNumber());
    });

    it('get stake token name', async() => {
        let tokenName = await stakeToken.name.call();
        assert.isString(tokenName);
    });

    it('get stake token symbol', async() => {
        let tokenSymbol = await stakeToken.symbol.call();
        assert.isString(tokenSymbol);
    });

    it('get stake token total supply', async() => {
        let tokenSupply = await stakeToken.totalSupply.call();
        assert.isNumber(tokenSupply.toNumber());
    });
});