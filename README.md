<pre>
 ______  ___   __    ______ 
/_____/\/__/\ /__/\ /_____/\
\:::__\/\::\_\\  \ \\::::_\/_
   /: /  \:. `-\  \ \\:\/___/\
  /::/___ \:. _    \ \\_::._\:\
 /_:/____/\\. \`-\  \ \ /____\:\
 \_______\/ \__\/ \__\/ \_____\/   

</pre>

# ZNS

Zer0 Name Service (ZNS) is the underlying set of Ethereum-based smart contracts responsible for 'Global Addressing' within Zero. Similar to DNS, Global Addressing enables users and communities to establish and own global identities and namespaces within Zero. 

Addresses can be set to map to any type of arbitrary content source, such as:

- **Networks** that map to shared namespaces, such as a community, organization or DAO. 
- **Handles** that map to individual user accounts, which can represent either humans or bots.
- **Resources** that map to any type of computational resource, such as a binary file, url, hash, or text blob. 

## Why ZNS?

A global naming system is a necessary component for distributed systems like Zero, where system state resides across multiple parallel systems and is not stored in a single central server or decentralized blockchain. Our goal is that modern browsers and projects across the web3 ecosystem will adopt the ZNS protocol to create a more customizable, flexible, and decentralized alternative to modern DNS.
 
## Addressing

Zero Addresses are made up of a hierarchical set of registries and registry entries on the Ethereum blockchain. Let's review an addresses constituent parts by evaluating the following address: ```0:rootaddr:subdomain:content```:

- ```0:``` -> is used to signify the beginning of a Zero Address path.
- ```0:rootaddr``` -> The first value in the address is a ***domain*** that references a unique Registry Contract and user-defined reference value.
- ```0:rootaddr:subdomain``` -> The second value in the address is a **subdomain** that references an Entry within the Registry, along with a user-defined reference value.
- ```0:rootaddr:subdomain:content``` -> The third value in the address represents a ***path*** defined within the Registry Entry.

In relation to traditional DNS addressing, the ```0:``` is comparable to ```http://``, the  ```rootaddr``` referenced above can be compared to a TLD, a domain can be compared the ```subdomain```, and the ```content``` represents the local path on an individual webserver. 

## Contracts

Contracts should be deployed to the blockchain in the following order:

***Registrar***

  ```Registrar.sol``` is the root contract for creating and storing Registries. New Registries are created by calling the ```createRegistry()``` method by providing a valid:
   - ```domain```: a globally unique and user-defined identity such as ```0:zero```
   - ```ref```: a reference to an arbitrary content source such as a url like ```https://zer0.io/network/zero```
   - ```registryType```: a valid registry type to aid with indexing registries. Valid registry types are defined by the ZNS DAO.
   - ```stakePrice```: the price of registering an entry (a subdomain) with the Registry such as ```0:zero:guild```
   - ```registryTokenAddress```: the address of the registry's ```RegistryToken```.

***RegistryToken***

  ```RegistryToken.sol``` is the associated token contract for a specific ```Registry``` that is based on the OpenZepplin [ERC20 standard] (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol). The ```RegistryToken``` is responsible for the finanical related activity of a ```Registry``` including adding and removing stakers, minting and burning registry tokens, and depositing and withdrawing (via staking) funds into the ```RegistryToken``` contract. A new ```RegistryToken``` is created on construction by providing a valid:
   - ```owner```: the owner's Ethereum address
   - ```tokenName```: the token's name such as ```Infinity```
   - ```tokenSymbol```: the token's ticker such as ```INI```
   - ```tokenSupply```: the token's total initial supply
   - ```stakePrice```: the price of registering a ```RegistryToken```

***Registry***

  ```Registry.sol``` is the contract is responsible for managing and updating entries (called 'subdomains') within an individual ```Registry```. A ```Registry``` initialized by calling the ```init()``` function on the newly created ```Registry``` by providing a valid ```domain```, ```ref```, ```registryType``` and ```registryToken``` address. A new ```RegistryEntry``` can be added by calling the ```CreateRegistryEntry()``` method and providng a valid ```domain``` and ```ref```.

## Security

ZNS is still in alpha phase. We have done the best to create secure and tested code, however have not yet performed any external security audits. Please understand that we are not responsible for domain purchases or the result for any implementations of this protocol. Please use common sense and proceed with caution. 

## Getting Started

### Requirements 

- Node.js is required
- [Truffle](https://github.com/ConsenSys/truffle) is required
- A blockchain explorer such as ([Ganache](https://www.trufflesuite.com/ganache)

### Installing 

From the ZNS directory:

1. ```npm install```
2. Install and initialize truffle
   ```sh
   npm install -g truffle
   mkdir ZNS && cd ZNS
   truffle
   ```
3. Install the ZNS contracts package with: ```npm install zns```
4. Download, install and start Ganache with: ```ganache-client```
5. Deploy the ZNS contracts with: ```truffle deploy```

### Testing

```truffle test```

## License

Governed by the InnerSource License.