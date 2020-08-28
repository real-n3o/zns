const StakeToken = artifacts.require('StakeToken.sol');

let testAddress = '0x1770579e56dab8823cb7b4f16b664c71c34cee5e';
let tokenName = "Meow";
let tokenTicker = "stakeTokenTicker";
let tokenSupply = 100;
let stakeValue = 1682160000000001;

contract('StakeToken', (accounts) => { 

    let stakeToken;
    const owner = accounts[0];

    it('Deploy StakeToken and mint tokens to address', async () => {
        stakeToken = await StakeToken.new(owner, tokenName, tokenTicker, tokenSupply);
        assert.isString(stakeToken.address);
    });

    it('Add Staker', async () => {
        const addStaker = await stakeToken.addStaker(testAddress);
        assert.isString(addStaker.tx);
        let stakerBalance = await stakeToken.getBalanceAddress.call(testAddress);
        assert.equal(stakerBalance.toNumber(), 0);
    });

    it('Address isStaker: false', async () => {
        await stakeToken.addStaker(accounts[0]);
        const isStaker = await stakeToken.isStaker(testAddress);
        assert.isNotTrue(isStaker[0]);
        assert.equal(isStaker[1].toNumber(), 0);
    });

    it('Remove Staker', async () => {
        const removeStaker = await stakeToken.removeStaker(accounts[0]);
        assert.isString(removeStaker.tx);
    });

    it('Send Stake to StakeToken Wallet', async () => {
        let sendStake = await stakeToken.sendStake.sendTransaction({
            from: accounts[0],
            value: stakeValue,
        });
        assert.isString(sendStake.tx);
        let stakerBalance = await stakeToken.getBalanceAddress.call(accounts[0]);
        assert.isAtLeast(stakerBalance.toNumber(), stakeValue);
        console.log(stakerBalance.toNumber());
        console.log(await web3.eth.getBalance(accounts[0]));
    });

    it('Add Staker after Stake has been sent', async () => {
        const sendStake = await stakeToken.addStaker(accounts[0]);
        assert.isString(sendStake.tx);
        let stakerBalance = await stakeToken.getBalanceAddress.call(accounts[0]);
        assert.isNumber(stakerBalance.toNumber());
    });

    it('Address isStaker: true', async () => {
        const isStaker = await stakeToken.isStaker(accounts[0]);
        assert.isTrue(isStaker[0]);
        assert.isNumber(isStaker[1].toNumber());
    });

    it('Get Total Balance', async () => {
        const totalBalance = await stakeToken.getBalance.call();
        assert.isNumber(totalBalance.toNumber());
    });

    it('Get Address Balance', async () => {
        let addressBalance = await stakeToken.getBalanceAddress.call(accounts[0]);
        assert.isNumber(addressBalance.toNumber());
    });

    it('Withdraw Stake from StakeToken Wallet', async() => {
        let withdrawStake = await stakeToken.withdrawStake.sendTransaction({
            from: accounts[0]
        });        
        assert.isString(withdrawStake.tx);
        console.log(await web3.eth.getBalance(accounts[0]));
        let stakerBalance = await stakeToken.getBalanceAddress.call(accounts[0]);
        console.log(stakerBalance.toNumber());
        assert.isBelow(stakerBalance.toNumber(), stakeValue);
    });

});