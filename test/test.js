// const Registry = artifacts.require('Registry');
// const RegistryToken = artifacts.require('RegistryToken');

// contract('RegistryToken', (accounts) => {

//     let testAddress = '0x1770579e56dab8823cb7b4f16b664c71c34cee5e';
//     let domain = 'domain';
//     let ref = 'ref';
//     let newRef = "newRef";
//     let registryType = 'type';
//     let tokenName = 'Meow';
//     let tokenSymbol = "MWM";
//     let tokenSupply = 100;
//     let stakePrice = 250;

//     let registryEntrySubdomain = "subdomain";
//     let registryEntryRef = "subdomain_ref";

//     let newRegistryEntrySubdomain = "new_subdomain";
//     let newRegistryEntryRef = "new_subdomain_ref";

//     let registryToken;
//     let registry;
//     let owner = accounts[0];

//     before(async () => {
//         registryToken = await RegistryToken.new(owner, tokenName, tokenSymbol, tokenSupply, stakePrice);
//         registry = await Registry.new(); 
//     });

//     // Creators

//     it('deploy RegistryToken', async () => {
//         registryToken = await RegistryToken.new(owner, tokenName, tokenSymbol, tokenSupply, stakePrice);
//         assert.isString(registryToken.address);
//     });

//     it('add staker', async () => {
//         const addStaker = await registryToken.addStaker(testAddress);
//         assert.isString(addStaker.tx);
//         let stakerBalance = await registryToken.getBalanceAddress.call(testAddress);
//         assert.equal(stakerBalance.toNumber(), 0);
//     });

//     // it('address is not a staker', async () => {
//     //     await registryToken.addStaker(accounts[0]);
//     //     const isStaker = await registryToken.isStaker(testAddress);
//     //     assert.isNotTrue(isStaker[0]);
//     //     assert.equal(isStaker[1].toNumber(), 0);
//     // });

//     // it('remove staker', async () => {
//     //     const removeStaker = await registryToken.removeStaker(accounts[0]);
//     //     assert.isString(removeStaker.tx);
//     // });

//     // it('send stake to a stake tokens wallet', async () => {
//     //     let sendStake = await registryToken.sendStake.sendTransaction({
//     //         from: accounts[0],
//     //         value: stakePrice,
//     //     });
//     //     assert.isString(sendStake.tx);
//     //     let stakerBalance = await registryToken.getBalanceAddress.call(accounts[0]);
//     //     assert.isAtLeast(stakerBalance.toNumber(), stakePrice);
//     // });

//     // it('add staker after stake has been sent', async () => {
//     //     const sendStake = await registryToken.addStaker(accounts[0]);
//     //     assert.isString(sendStake.tx);
//     //     let stakerBalance = await registryToken.getBalanceAddress.call(accounts[0]);
//     //     assert.isNumber(stakerBalance.toNumber());
//     // });

//     // it('withdraw a stake from a stake token wallet', async() => {
//     //     let withdrawStake = await registryToken.withdrawStake.sendTransaction({
//     //         from: accounts[0]
//     //     });        
//     //     assert.isString(withdrawStake.tx);
//     //     let stakerBalance = await registryToken.getBalanceAddress.call(accounts[0]);
//     //     assert.isBelow(stakerBalance.toNumber(), stakePrice);
//     // });

// });