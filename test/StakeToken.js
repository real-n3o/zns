const StakeToken = artifacts.require('StakeToken.sol');

let testAddress = '0x1770579e56dab8823cb7b4f16b664c71c34cee5e';

contract('Registrar', () => { 
    it('Mint token to address', async () => {
        const deployedStakeToken = await StakeToken.new(testAddress);
        // assert.isString(deployedStakeToken);
    });
});