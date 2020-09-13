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

Zer0 Name Service (ZNS) is the underlying set of Ethereum-based smart contracts responsible for 'Global Addressing' within Zero. Similar to DNS, Global Addressing enables users and communities to establish and own global identities and namespaces within Zero and any peer-to-peer system. 

Addresses can be set to map to any type of arbitrary content source, such as:

- **Networks** that map to shared namespaces, such as a community, organization or DAO. 
- **Handles** that map to individual user accounts, which can represent either humans or bots.
- **Resources** that map to any type of computational resource, such as a binary file, url, hash, or text blob. 

## Why ZNS?

A global naming system is a necessary component for distributed systems like Zero, where system state resides within multiple parallel systems and is not stored in a single central server or decentralized blockchain. The goal is that modern browsers and projects across the web3 ecosystem adopt the ZNS protocol to create a more customizable, flexible, and decentralized alternative to modern DNS (with vastly improved financial incentives).
 
## Addressing

Zero Addresses are made up of a hierarchical set of registries and registry entries on the Ethereum blockchain. Let's review the constituent parts of a Zero Address by evaluating the following: ```0:rootaddr:subdomain:content```

- ```0:``` -> is used to signify the beginning of a Zero Address path.
- ```0:rootaddr``` -> The first value in the address is a ***domain*** that references a unique Registry Contract and user-defined reference value.
- ```0:rootaddr:subdomain``` -> The second value in the address is a **subdomain** that references an Entry within the Registry, along with a user-defined reference value.
- ```0:rootaddr:subdomain:content``` -> The third value in the address represents a ***path*** defined within the Registry Entry.

In relation to traditional DNS addressing, the ```0:``` is comparable to ```http://```, the  ```rootaddr``` can be compared to a TLD, the ```subdomain``` is comparable to a domain, and the ```content``` is comparable to a relative path on a webserver. 

## Contracts

ZNS is made up of four primary contracts that should be deployed in the following order:

***Registrar***

  + ```Registrar.sol``` is the root contract for creating and storing Registries. New Registries are created by calling the ```createRegistry()``` method by providing a valid:
    - ```domain```: a globally unique and user-defined identity such as ```zero```
    - ```ref```: a reference to an arbitrary content source such as a url like ```https://zer0.io/network/zero```
    - ```registryType```: a valid registry type to aid with indexing registries. Valid registry types are defined by the ZNS DAO (See Governance & Staking section below).
    - ```stakePrice```: the price of registering an entry (a subdomain) with the Registry such as ```zero:guild```
    - ```registryTokenAddress```: the address of the registry's ```RegistryToken```.

***RegistryToken***

  + ```RegistryToken.sol``` is the associated token contract for a specific ```Registry``` that is based on the OpenZepplin [ERC20 standard](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol). 
  + The ```RegistryToken``` is responsible for the financial related activity of a ```Registry``` including adding and removing stakers, minting and burning a registry's tokens, and depositing and withdrawing (via staking) funds into the ```RegistryToken``` contract itself. 
  + A new ```RegistryToken``` is created on construction by providing a valid:
    - ```owner```: the owner's Ethereum address
    - ```tokenName```: the token's name such as 'Infinity'
    - ```tokenSymbol```: the token's ticker such as 'INI'
    - ```tokenSupply```: the token's initial total number of tokens in circulation
    - ```stakePrice```: the price for registering a new registry entry (a subdomain)

***Registry***

  + ```Registry.sol``` is the contract is responsible for managing and updating registry entries (called 'subdomains') within an individual ```Registry```. 
  + A ```Registry``` must be initialized by calling the ```init()``` function after creation by providing a valid ```domain```, ```ref```, ```registryType``` and ```registryToken``` address. 
  + A new ```RegistryEntry``` can be added by calling the ```CreateRegistryEntry()``` method and providing a valid ```domain``` and ```ref```.

***RegistryController***

  + ```RegistryController.sol``` is the main contract that validates permissible user actions on a particular ```Registry```, ```RegistryEntry```, and ```RegistryToken```. 
  + After creation and initialization, all interactions with the contract-set for a particular Registry must happen via ```RegistryController``` for security purposes.
  + After a new ```RegistryController``` is created it must be initialized by calling the ```init()``` method and providing a valid ```registry``` address and ```registryToken``` address.

## Staking & Governance

One of the unique properties of ZNS is the introduction of blockchain staking and (optional) DAO-based governance at the ```Registry``` and ```RegistryEntry``` level. Post MainNet launch, anyone will be free to purchase new Registries by staking Infinity equal to the ```stakePrice``` set within the ZNS Global Registrar. The ```stakePrice``` can be increased or decreased overtime via the submission and acceptance of a proposal from within the ZNS DAO. Purchasers of domains (Registries) and subdomains (Registry Entries) are automatically added as Members (along with voting power) to the ZNS DAO, which is the owner of the ```Registrar``` contract. This ensures that all ZNS owners (at both the domain and subdomain levels) maintain the rights to set the Registry stakePricing and vote on system upgrades. 

Governance for individual Registries operates similar to the Registrar, with the exception that the contract owner can establish a custom ```stakePrice``` and DAO-based governance system after the Registry is purchased. For instance, a user could purchase the Registry at ```0:ninja```, declare themselves dictator, and create a prohibitively high price for the creation of new Registry Entires (subdomains). Alternatively, a benevolent servant could purchase ```0:everyone``` and democratize the subdomain pricing and choice-making for the Registry.

Given that each ```Registry``` has its own ```RegistryToken```, Registry operators can additionally create staking-based incentives via the issuance of governance tokens (similar to modern DeFi protocols). This creates a 'market of markets'; a incentive-based directory structure for curating and traversing content-sources across web3 protocols and the Internet at large.

## Networks, Worlds, Universes

The collective set of Zero Addresses and referenced content within ZNS is colloquially referred to as the 'MetaVerse', 'ZeroVerse', or 'Network Constellation'. Registries may be linked to one or more other Registries via the initiation and acceptance of a 'connection request'. In order for a connection to occur, both Registry owners must both accept the proposed connection request (similar to a friend request on Facebook). This enables the emergence of a visual network constellation for navigating networks and relative content sources.

For deeper categorization, projects can determine their own naming conventions for categorizing content-types and network clusters across groups of ZNS Registries and Registry Entries. For example, the Zero App utilizes the following definitions to represent different types of networks:

- ***Networks*** represent private namespaces such as a group, team, organization or community
- ***Worlds*** represent a collection of private namespaces such as a cluster or communities (a 'Network of Networks')
- ***Universes*** represent multiple different collections of (a 'Network of Networks of Networks')

## Human Verification

...

## Security

ZNS is still in alpha phase. We have done the best to create secure and tested code, however have not yet performed any external security audits. Please understand that we are not responsible for domain purchases or the result for any implementations of this protocol. Please use common sense and proceed with caution. 

## Getting Started

### Requirements 

- Node.js is required
- [Truffle](https://github.com/ConsenSys/truffle) is required
- A blockchain explorer such as [Ganache](https://www.trufflesuite.com/ganache)

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

From the ZNS directory, run: ```truffle test```

## License

ZNS is governed and made publicly accessible under the terms and conditions of the InnerSource License. ZNS is proudly brought to you by n3o in collaboration with The One Foundation, The Zero Guild, and Wilder Studios.