const StakeToken = artifacts.require('StakeToken.sol');

let testAddress = '0x1770579e56dab8823cb7b4f16b664c71c34cee5e';

contract('StakeToken', (accounts) => { 

    let stakeToken;
    const owner = accounts[0];

    it('Deploy StakeToken and mint tokens to address', async () => {
        stakeToken = await StakeToken.new(owner, 250);
        assert.isString(stakeToken.address);
    });

    it('Add Staker', async () => {
        const addStaker = await stakeToken.addStaker(testAddress);
        assert.isString(addStaker.tx);
    });

    it('Remove Staker', async () => {
        const removeStaker = await stakeToken.removeStaker(testAddress);
        assert.isString(removeStaker.tx);
    });

    it('Address isStaker: false', async () => {
        const isStaker = await stakeToken.isStaker(testAddress);
        assert.isNotTrue(isStaker[0]);
        assert.isNumber(isStaker[1].toNumber());
    });

    it('Address isStaker: true', async () => {
        await stakeToken.addStaker(testAddress);
        const isStaker = await stakeToken.isStaker(testAddress);
        assert.isTrue(isStaker[0]);
        assert.isNumber(isStaker[1].toNumber());
    });

    it('Send and Receive Stake to StakeToken contract', async () => {
        const sendStake = await stakeToken.sendStake.sendTransaction({
            from: accounts[0],
            value: "1250"
        });
        assert.isString(sendStake.tx);
        let newBalance = await stakeToken.balance.call();
        console.log(newBalance.toNumber());
    });
});